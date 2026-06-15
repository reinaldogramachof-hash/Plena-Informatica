import re

html_path = r"c:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena\servicos\servicos.html"

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace all .png with .webp inside the imagens/ folder
content = re.sub(r'src="imagens/(.*?)\.png"', r'src="imagens/\1.webp"', content)

# 2. Find Set 2 comment and add loading="lazy" decoding="async" to its images
parts = content.split('<!-- Set 2 (Clone para Loop Perfeito) -->')
if len(parts) == 2:
    set2_content = parts[1]
    # The end of the image list is marked by </div> for the image-scroller-track
    end_index = set2_content.find('</div>')
    images_block = set2_content[:end_index]
    rest_of_html = set2_content[end_index:]
    
    # Add lazy loading
    modified_images_block = re.sub(r'<img src="(.*?)" alt="(.*?)">', r'<img src="\1" alt="\2" loading="lazy" decoding="async">', images_block)
    
    parts[1] = modified_images_block + rest_of_html
    content = '<!-- Set 2 (Clone para Loop Perfeito) -->'.join(parts)

# 3. Add preload for the first image in the head
preload_tag = '  <link rel="preload" as="image" href="imagens/abertura_mei.webp">\n</head>'
content = content.replace('</head>', preload_tag)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML atualizado com sucesso!")
