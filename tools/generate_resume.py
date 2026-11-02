"""Build the offline resume from index.html (pip install reportlab lxml).

Run from any directory. Set RESUME_FONT and RESUME_FONT_BOLD to CJK TrueType
font paths on non-Windows systems. TTC fonts use their first subfont.
"""
from pathlib import Path
from html import escape
import os
import re

from lxml import html
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'assets' / 'cliff-lin-resume.pdf'
FONT = os.environ.get('RESUME_FONT', 'C:/Windows/Fonts/msjh.ttc')
BOLD = os.environ.get('RESUME_FONT_BOLD', 'C:/Windows/Fonts/msjhbd.ttc')
for name, path in [('Resume', FONT), ('ResumeBold', BOLD)]:
    pdfmetrics.registerFont(TTFont(name, path, subfontIndex=0))
pdfmetrics.registerFontFamily('Resume', normal='Resume', bold='ResumeBold', italic='Resume', boldItalic='ResumeBold')
tree = html.fromstring((ROOT / 'index.html').read_text(encoding='utf-8'))
BLUE = colors.HexColor('#2f639f')
INK = colors.HexColor('#182231')
GRAY = colors.HexColor('#536174')

def cls(name, root=tree):
    return root.xpath('.//*[contains(concat(" ", normalize-space(@class), " "), " '+name+' ")]')

def text(node):
    return re.sub(r'\s+', ' ', node.text_content()).strip().replace('—', '-').replace('–', '-')

styles = {
    'body': ParagraphStyle('body', fontName='Resume', fontSize=9.2, leading=12.4,
                           textColor=INK, spaceAfter=3, wordWrap='CJK'),
    'small': ParagraphStyle('small', fontName='Resume', fontSize=8, leading=11,
                            textColor=GRAY, spaceAfter=3, wordWrap='CJK'),
    'title': ParagraphStyle('title', fontName='ResumeBold', fontSize=30, leading=36,
                            textColor=INK, spaceAfter=8),
    'section': ParagraphStyle('section', fontName='ResumeBold', fontSize=17, leading=23,
                              textColor=BLUE, spaceBefore=7, spaceAfter=12),
    'heading': ParagraphStyle('heading', fontName='ResumeBold', fontSize=11, leading=15,
                              textColor=BLUE, spaceBefore=6, spaceAfter=4, keepWithNext=True,
                              wordWrap='CJK'),
}
story = []
def p(value, kind='body'):
    return Paragraph(escape(value), styles[kind])
def add(value, kind='body'):
    story.append(p(value, kind))
def bullet(value):
    add('• '+value)
def section(value):
    add(value, 'section')
def page(value):
    story.append(PageBreak())
    section(value)

add('Cliff Lin', 'title')
add('SOLUTION ARCHITECT', 'heading')
add(text(cls('hero-role')[0]), 'body')
story.append(Paragraph('<link href="https://cliffium.github.io/" color="#2f639f">cliffium.github.io</link>', styles['small']))
add(text(cls('hero-copy')[0]))
section('個人簡介 / Profile')
for node in cls('lead', cls('profile-section')[0]):
    add(text(node))
section('技術能力 / Technical Skills')
for group in cls('skill-section'):
    title = text(group.find('h3'))
    skills = [text(n.find('strong'))+' ('+text(n.find('span'))+')' for n in cls('skill-card', group)]
    add(title, 'heading')
    add(' | '.join(skills))
add('Supporting Technologies', 'heading')
for group in cls('supporting-group'):
    add(text(group.find('h4'))+': '+', '.join(text(n) for n in cls('support-card', group)), 'small')
section('語言與學歷 / Languages & Education')
for node in cls('language-list')[0].findall('article'):
    d = node.find('div')
    add(text(d.find('h3'))+': '+text(d.find('p')))
education = cls('education-card')[0]
add(' | '.join(text(n) for n in education))

page('工作經歷 / Professional Experience')
for card in cls('experience-card'):
    head = cls('experience-head', card)[0]
    add(text(head.find('.//h3'))+' | '+text(cls('exp-period', head)[0]), 'heading')
    add(text(head.find('div/p[last()]')), 'small')
    for node in cls('role-evolution', card):
        add(text(node), 'small')
    summaries = cls('summary-bullets', card)
    if summaries:
        for li in summaries[0].findall('li'):
            bullet(text(li))
    for node in cls('experience-one-line', card):
        add(text(node))
    for detail in cls('experience-detail', card):
        for child in detail:
            if child.tag == 'h4':
                add(text(child), 'heading')
            elif child.tag == 'ul':
                for li in child.findall('li'):
                    bullet(text(li))
            elif 'architecture-highlight' in child.get('class', ''):
                add(text(child.find('.//h4')), 'heading')
                add(text(cls('architecture-copy', child)[0].findall('p')[1]))
                add('HAProxy > Ingress > 3 Control Planes + 3 Worker Nodes > Hyper-V', 'small')

page('精選專案 / Selected Projects')
for card in cls('project-card'):
    content = cls('project-content', card)[0]
    add(text(content.find('h3')), 'heading')
    tags = ' / '.join(text(n) for n in cls('tag-row', content)[0])
    add(text(cls('project-type', content)[0])+' | '+tags, 'small')
    add(text(content.findall('p')[1]))
    for detail in cls('detail-grid', card):
        for item in detail.findall('div'):
            add(text(item.find('h4'))+': '+text(item.find('p')))
    demos = cls('project-actions', content)[0].findall('a')
    for link in demos:
        url = escape(link.get('href'), quote=True)
        story.append(Paragraph(f'<link href="{url}" color="#2f639f">Demo: {url}</link>', styles['small']))
    story.append(Spacer(1, 5))

def footer(canvas, doc):
    w, h = A4
    canvas.setStrokeColor(colors.HexColor('#d7dde6'))
    canvas.line(42, 34, w-42, 34)
    canvas.setFont('Resume', 8)
    canvas.setFillColor(GRAY)
    canvas.drawString(42, 21, 'Cliff Lin | Solution Architect | cliffium.github.io')
    canvas.drawRightString(w-42, 21, str(doc.page))
    if doc.page > 1:
        canvas.setFont('Resume', 8)
        canvas.drawString(42, h-25, 'CLIFF LIN / RESUME')

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=42, leftMargin=42,
                        topMargin=40, bottomMargin=46,
                        title='Cliff Lin - Solution Architect', author='Cliff Lin')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
