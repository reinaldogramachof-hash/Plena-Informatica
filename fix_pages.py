import os
import re

gtm_head = """
    <!-- TODO: Após criar propriedade GA4 em analytics.google.com, substitua G-XXXXXXXXXX pelo ID real nas Tags GTM -->
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-57SHPVLX');</script>
    <!-- End Google Tag Manager -->
"""

gtm_body = """
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-57SHPVLX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
"""

def inject_gtm(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject head
    if 'GTM-57SHPVLX' not in content:
        content = content.replace('<head>', '<head>' + gtm_head, 1)
        content = re.sub(r'<body.*?>', lambda m: m.group(0) + gtm_body, content, count=1)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"GTM injected into {filepath}")
    else:
        print(f"GTM already present in {filepath}")

def fix_tecnologia_buttons(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to add whatsapp-btn class to any element containing onclick="openWhatsApp...
    # Let's find tags containing openWhatsAppForOffer or openWhatsAppByKey
    
    def add_class(match):
        tag = match.group(0)
        if 'whatsapp-btn' not in tag:
            if 'class="' in tag:
                return tag.replace('class="', 'class="whatsapp-btn ')
            else:
                return tag.replace('onclick="', 'class="whatsapp-btn" onclick="')
        return tag

    new_content = re.sub(r'<button[^>]*onclick="openWhatsApp[^>]*>', add_class, content)
    new_content = re.sub(r'<a[^>]*api\.whatsapp\.com[^>]*>', add_class, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"WhatsApp buttons fixed in {filepath}")
    else:
        print(f"No WhatsApp buttons needed fixing in {filepath}")

base_dir = r"c:\Users\reina\OneDrive\Desktop\Projetos\Site Institucional Plena"
pages = [
    os.path.join(base_dir, "servicos", "servicos.html"),
    os.path.join(base_dir, "personalizados", "personalizados.html"),
    os.path.join(base_dir, "tecnologia", "tecnologia.html")
]

for p in pages:
    inject_gtm(p)

fix_tecnologia_buttons(os.path.join(base_dir, "tecnologia", "tecnologia.html"))
