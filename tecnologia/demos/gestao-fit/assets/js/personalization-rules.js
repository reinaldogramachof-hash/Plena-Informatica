/* Opções locais restritas: imagens raster, cores com contraste e assinatura em texto. */
const FitPersonalizationRules = (() => {
    const palettes = { green: ['#15803d', '#166534'], blue: ['#1d4ed8', '#1e40af'], violet: ['#6d28d9', '#5b21b6'], teal: ['#0f766e', '#115e59'] };
    function validate(data) {
        const p = data.settings.presentation; if (p === undefined) return data;
        if (!p || p.version !== 1 || !Object.hasOwn(palettes, p.palette) || ![14, 16, 18].includes(p.fontSize) || typeof p.signature !== 'string' || p.signature.length > 300 || typeof p.logo !== 'string' || p.logo.length > 300000) throw new Error('Personalização incompatível.');
        if (p.logo) {
            const match = p.logo.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/); if (!match) throw new Error('Use imagem PNG, JPEG ou WebP válida.');
            let bytes; try { bytes = atob(match[2]); } catch { throw new Error('Imagem inválida.'); }
            const magic = match[1] === 'png' ? bytes.startsWith('\x89PNG\r\n\x1a\n') : match[1] === 'jpeg' ? bytes.startsWith('\xff\xd8\xff') : bytes.startsWith('RIFF') && bytes.slice(8, 12) === 'WEBP';
            if (!magic) throw new Error('O conteúdo da imagem não corresponde ao formato.');
        }
        return data;
    }
    function save(data, input) { const result = FitData.clone(data); result.settings.presentation = { version: 1, palette: input.palette, fontSize: Number(input.fontSize), signature: String(input.signature || '').trim(), logo: input.logo || '' }; return validate(result); }
    return { palettes, validate, save };
})();
