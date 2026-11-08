/**
 * Regras Puras de Suporte — Gestão Terapia
 * Validações e formatações sem dependência de DOM ou rede.
 */
const TherapySupportRules = (() => {
    const categories = {
        'duvida': 'Dúvida de Uso',
        'problema': 'Problema / Erro Técnico',
        'sugestao': 'Sugestão de Melhoria',
        'outro': 'Outro Assunto'
    };

    const statuses = {
        'open': { label: 'Aberto', tone: 'emerald' },
        'waiting_support': { label: 'Aguardando Resposta', tone: 'amber' },
        'waiting_user': { label: 'Resposta Recebida', tone: 'blue' },
        'resolved': { label: 'Resolvido', tone: 'purple' },
        'closed': { label: 'Encerrado', tone: 'slate' }
    };

    function validateTicket(input) {
        const subject = String(input?.subject || '').trim();
        const message = String(input?.message || '').trim();
        const category = String(input?.category || 'duvida').trim().toLowerCase();

        if (!subject) {
            throw new Error('Informe o assunto do chamado.');
        }
        if ([...subject].length < 4 || [...subject].length > 160) {
            throw new Error('O assunto deve ter entre 4 e 160 caracteres.');
        }
        if (!message) {
            throw new Error('Descreva a mensagem do chamado.');
        }
        if ([...message].length < 10 || [...message].length > 4000) {
            throw new Error('A mensagem deve ter entre 10 e 4000 caracteres.');
        }
        if (!categories[category]) {
            throw new Error('Categoria de chamado inválida.');
        }

        return {
            subject,
            message,
            category
        };
    }

    function validateReply(message) {
        const clean = String(message || '').trim();
        if (!clean) {
            throw new Error('A mensagem não pode ficar em branco.');
        }
        if ([...clean].length > 4000) {
            throw new Error('A mensagem excede o limite de 4000 caracteres.');
        }
        return clean;
    }

    function statusInfo(status) {
        return statuses[status] || { label: status || 'Desconhecido', tone: 'slate' };
    }

    function categoryLabel(cat) {
        return categories[cat] || 'Geral';
    }

    function formatDate(isoString) {
        if (!isoString) return '';
        try {
            const d = new Date(isoString);
            if (isNaN(d.getTime())) return String(isoString);
            return d.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return String(isoString);
        }
    }

    function escapeHtml(value) {
        if (value === null || value === undefined) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    return {
        categories,
        statuses,
        validateTicket,
        validateReply,
        statusInfo,
        categoryLabel,
        formatDate,
        escapeHtml
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TherapySupportRules;
}
