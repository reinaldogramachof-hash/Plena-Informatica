window.THERAPY_DEMO_SEED = {
  "settings": {
    "clinicName": "Clínica Horizonte",
    "sessionDuration": 50,
    "reminderHours": 24,
    "therapistLicense": "",
    "clinicPhone": "",
    "ownerName": "Marina Duarte Vasconcelos",
    "ownerDoc": "",
    "sessionFee": 180,
    "emergencyContact": "",
    "hospitalReference": "",
    "security": {
      "autoLockMinutes": 15
    },
    "coverage": {
      "privateColor": "#2563EB",
      "reimbursementColor": "#B45309",
      "plans": [
        {
          "id": "demo_convenio_horizonte",
          "name": "Convênio Horizonte",
          "color": "#0F766E",
          "active": true
        },
        {
          "id": "demo_convenio_aurora",
          "name": "Convênio Aurora",
          "color": "#7C3AED",
          "active": true
        },
        {
          "id": "demo_convenio_legado",
          "name": "Convênio Legado",
          "color": "#64748B",
          "active": false
        }
      ]
    },
    "assistant": {
      "confirmationDays": 1,
      "backupDays": 7,
      "palette": "emerald",
      "logo": "",
      "signature": "Clínica Horizonte",
      "templates": {
        "confirmation": "Olá, {nome}! Podemos confirmar nosso horário de {data}, às {hora}?\n{assinatura}",
        "payment": "Olá, {nome}! Gostaria de conferir o pagamento previsto para {data}, no valor de {valor}. Caso já tenha realizado, por favor me avise.\n{assinatura}",
        "package": "Olá, {nome}! Podemos combinar a organização dos próximos horários?\n{assinatura}",
        "followup": "Olá, {nome}! Estou entrando em contato para combinarmos nosso retorno. Qual o melhor horário para conversarmos?\n{assinatura}"
      },
      "recurring": [
        {
          "id": "demo_rec_video",
          "description": "Plataforma de videoconferência",
          "amount": 39,
          "day": 15,
          "start": "2026-11",
          "end": "",
          "enabled": true
        },
        {
          "id": "demo_rec_domain",
          "description": "Hospedagem e domínio",
          "amount": 49,
          "day": 31,
          "start": "2026-11",
          "end": "",
          "enabled": true
        },
        {
          "id": "demo_rec_paused",
          "description": "Material de estudo pausado",
          "amount": 80,
          "day": 10,
          "start": "2026-11",
          "end": "",
          "enabled": false
        }
      ]
    },
    "agenda": {
      "version": 1,
      "defaultView": "week",
      "weekStartsOn": 1,
      "showWeekends": true,
      "slotMinutes": 30,
      "displayStart": "08:00",
      "displayEnd": "20:00",
      "density": "comfortable",
      "bufferMinutes": 10,
      "enforceHours": true,
      "showNational": true,
      "showReferences": true,
      "blockNational": true,
      "showInactive": true,
      "hideNames": false,
      "city": "",
      "state": "",
      "customDates": [],
      "blocks": [
        {
          "id": "demo_supervisao",
          "startDate": "2026-11-05",
          "endDate": "2026-11-05",
          "reason": "Supervisão profissional",
          "allDay": false,
          "startTime": "17:00",
          "endTime": "18:00"
        }
      ],
      "weekDays": [
        {
          "enabled": false,
          "periods": [
            {
              "start": "08:00",
              "end": "12:00"
            },
            {
              "start": "14:00",
              "end": "20:00"
            }
          ]
        },
        {
          "enabled": true,
          "periods": [
            {
              "start": "08:00",
              "end": "12:00"
            },
            {
              "start": "14:00",
              "end": "20:00"
            }
          ]
        },
        {
          "enabled": true,
          "periods": [
            {
              "start": "08:00",
              "end": "12:00"
            },
            {
              "start": "14:00",
              "end": "20:00"
            }
          ]
        },
        {
          "enabled": true,
          "periods": [
            {
              "start": "08:00",
              "end": "12:00"
            },
            {
              "start": "14:00",
              "end": "20:00"
            }
          ]
        },
        {
          "enabled": true,
          "periods": [
            {
              "start": "08:00",
              "end": "12:00"
            },
            {
              "start": "14:00",
              "end": "20:00"
            }
          ]
        },
        {
          "enabled": true,
          "periods": [
            {
              "start": "08:00",
              "end": "12:00"
            },
            {
              "start": "14:00",
              "end": "20:00"
            }
          ]
        },
        {
          "enabled": false,
          "periods": [
            {
              "start": "08:00",
              "end": "12:00"
            },
            {
              "start": "14:00",
              "end": "20:00"
            }
          ]
        }
      ]
    },
    "professionalName": "Marina Duarte Vasconcelos"
  },
  "system": "gestao-terapia",
  "patients": [
    {
      "id": "demo_patient_01",
      "name": "Ana Clara Monteiro",
      "birth": "1978-01-15",
      "phone": "",
      "email": "paciente01@example.invalid",
      "occupation": "Professora",
      "complaint": "Adaptação a mudanças na rotina.",
      "history": "Iniciou acompanhamento após mudança de trabalho e reorganização da rotina familiar.",
      "risk": "nenhum",
      "emergencyName": "Henrique Barros Almeida",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "private",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Ana",
        "document": "",
        "pronouns": "",
        "source": "Indicação espontânea",
        "channel": "email",
        "permission": "allowed",
        "modality": "in_person",
        "availability": "Dias úteis · 08:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_0",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_0",
            "title": "Conferir disponibilidade para próxima sessão",
            "dueDate": "2026-11-02",
            "priority": "high",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_0",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_02",
      "name": "Bruno Henrique Azevedo",
      "birth": "1979-02-15",
      "phone": "",
      "email": "paciente02@example.invalid",
      "occupation": "Analista administrativo",
      "complaint": "Organização de demandas do trabalho.",
      "history": "Procura compreender as demandas profissionais e os limites na rotina.",
      "risk": "nenhum",
      "emergencyName": "Isabela Rocha Siqueira",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte"
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Bruno",
        "document": "",
        "pronouns": "",
        "source": "Busca na internet",
        "channel": "email",
        "permission": "allowed",
        "modality": "online",
        "availability": "Dias úteis · 09:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Online"
        ],
        "contacts": [
          {
            "id": "demo_contact_1",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_1",
            "title": "Revisar dados administrativos",
            "dueDate": "2026-11-04",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_1",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_03",
      "name": "Camila Nogueira Batista",
      "birth": "1980-03-15",
      "phone": "",
      "email": "paciente03@example.invalid",
      "occupation": "Designer",
      "complaint": "Comunicação e relações familiares.",
      "history": "Retoma o acompanhamento para elaborar mudanças recentes nas relações familiares.",
      "risk": "risco",
      "emergencyName": "João Pedro Almeida",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora"
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Camila",
        "document": "",
        "pronouns": "",
        "source": "Indicação de profissional",
        "channel": "email",
        "permission": "allowed",
        "modality": "hybrid",
        "availability": "Dias úteis · 10:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência. Solicitou contato de acompanhamento após o último encontro.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_2",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_2",
            "title": "Confirmar retorno do encaminhamento",
            "dueDate": "2026-11-07",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_2",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_04",
      "name": "Diego Fernandes Ribeiro",
      "birth": "1981-04-15",
      "phone": "",
      "email": "paciente04@example.invalid",
      "occupation": "Técnico de informática",
      "complaint": "Rotina de sono e autocuidado.",
      "history": "Relata dificuldade em equilibrar descanso, trabalho e compromissos pessoais.",
      "risk": "nenhum",
      "emergencyName": "Karina Ribeiro Duarte",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "reimbursement",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Diego",
        "document": "",
        "pronouns": "",
        "source": "Retorno ao consultório",
        "channel": "email",
        "permission": "allowed",
        "modality": "in_person",
        "availability": "Dias úteis · 14:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_3",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_3",
            "title": "Conferir disponibilidade para próxima sessão",
            "dueDate": "2026-11-02",
            "priority": "high",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_3",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_05",
      "name": "Elisa Martins Pacheco",
      "birth": "1982-05-15",
      "phone": "",
      "email": "paciente05@example.invalid",
      "occupation": "Estudante",
      "complaint": "Transição acadêmica e profissional.",
      "history": "Está reorganizando planos de estudo e trabalho para o próximo semestre.",
      "risk": "nenhum",
      "emergencyName": "Lucas Teixeira Campos",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "unspecified",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Elisa",
        "document": "",
        "pronouns": "",
        "source": "Indicação espontânea",
        "channel": "email",
        "permission": "allowed",
        "modality": "online",
        "availability": "Dias úteis · 15:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Online"
        ],
        "contacts": [
          {
            "id": "demo_contact_4",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_4",
            "title": "Revisar dados administrativos",
            "dueDate": "2026-11-04",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_4",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_06",
      "name": "Felipe Andrade Torres",
      "birth": "1983-06-15",
      "phone": "",
      "email": "paciente06@example.invalid",
      "occupation": "Comerciante",
      "complaint": "Reconhecimento de emoções.",
      "history": "Busca compreender as emoções presentes em situações recorrentes do cotidiano.",
      "risk": "atenção",
      "emergencyName": "Mariana Castro Figueiredo",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "private",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Felipe",
        "document": "",
        "pronouns": "",
        "source": "Busca na internet",
        "channel": "email",
        "permission": "restricted",
        "modality": "hybrid",
        "availability": "Dias úteis · 16:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_5",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_5",
            "title": "Confirmar retorno do encaminhamento",
            "dueDate": "2026-11-07",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_5",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_07",
      "name": "Gabriela Costa Moreira",
      "birth": "1984-07-15",
      "phone": "",
      "email": "paciente07@example.invalid",
      "occupation": "Professora",
      "complaint": "Adaptação a mudanças na rotina.",
      "history": "Iniciou acompanhamento após mudança de trabalho e reorganização da rotina familiar.",
      "risk": "nenhum",
      "emergencyName": "Nicolas Freitas Cardoso",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte"
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Gabriela",
        "document": "",
        "pronouns": "",
        "source": "Indicação de profissional",
        "channel": "email",
        "permission": "allowed",
        "modality": "in_person",
        "availability": "Dias úteis · 08:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_6",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_6",
            "title": "Conferir disponibilidade para próxima sessão",
            "dueDate": "2026-11-02",
            "priority": "high",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_6",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_08",
      "name": "Henrique Barros Almeida",
      "birth": "1985-08-15",
      "phone": "",
      "email": "paciente08@example.invalid",
      "occupation": "Analista administrativo",
      "complaint": "Organização de demandas do trabalho.",
      "history": "Procura compreender as demandas profissionais e os limites na rotina.",
      "risk": "nenhum",
      "emergencyName": "Olívia Mendes Carvalho",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora"
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Henrique",
        "document": "",
        "pronouns": "",
        "source": "Retorno ao consultório",
        "channel": "email",
        "permission": "allowed",
        "modality": "online",
        "availability": "Dias úteis · 09:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Online"
        ],
        "contacts": [
          {
            "id": "demo_contact_7",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_7",
            "title": "Revisar dados administrativos",
            "dueDate": "2026-11-04",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_7",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_09",
      "name": "Isabela Rocha Siqueira",
      "birth": "1986-09-15",
      "phone": "",
      "email": "paciente09@example.invalid",
      "occupation": "Designer",
      "complaint": "Comunicação e relações familiares.",
      "history": "Retoma o acompanhamento para elaborar mudanças recentes nas relações familiares.",
      "risk": "nenhum",
      "emergencyName": "Paulo Henrique Lima",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "reimbursement",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Isabela",
        "document": "",
        "pronouns": "",
        "source": "Indicação espontânea",
        "channel": "email",
        "permission": "allowed",
        "modality": "hybrid",
        "availability": "Dias úteis · 10:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_8",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_8",
            "title": "Confirmar retorno do encaminhamento",
            "dueDate": "2026-11-07",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_8",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_10",
      "name": "João Pedro Almeida",
      "birth": "1987-10-15",
      "phone": "",
      "email": "paciente10@example.invalid",
      "occupation": "Técnico de informática",
      "complaint": "Rotina de sono e autocuidado.",
      "history": "Relata dificuldade em equilibrar descanso, trabalho e compromissos pessoais.",
      "risk": "nenhum",
      "emergencyName": "Rafaela Dias Monteiro",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "unspecified",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "João",
        "document": "",
        "pronouns": "",
        "source": "Busca na internet",
        "channel": "email",
        "permission": "allowed",
        "modality": "in_person",
        "availability": "Dias úteis · 14:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_9",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_9",
            "title": "Conferir disponibilidade para próxima sessão",
            "dueDate": "2026-11-02",
            "priority": "high",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_9",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_11",
      "name": "Karina Ribeiro Duarte",
      "birth": "1988-11-15",
      "phone": "",
      "email": "paciente11@example.invalid",
      "occupation": "Estudante",
      "complaint": "Transição acadêmica e profissional.",
      "history": "Está reorganizando planos de estudo e trabalho para o próximo semestre.",
      "risk": "atenção",
      "emergencyName": "Samuel Cardoso Vieira",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "private",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Karina",
        "document": "",
        "pronouns": "",
        "source": "Indicação de profissional",
        "channel": "email",
        "permission": "allowed",
        "modality": "online",
        "availability": "Dias úteis · 15:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Online"
        ],
        "contacts": [
          {
            "id": "demo_contact_10",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_10",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_12",
      "name": "Lucas Teixeira Campos",
      "birth": "1989-12-15",
      "phone": "",
      "email": "paciente12@example.invalid",
      "occupation": "Comerciante",
      "complaint": "Reconhecimento de emoções.",
      "history": "Busca compreender as emoções presentes em situações recorrentes do cotidiano.",
      "risk": "nenhum",
      "emergencyName": "Talita Moreira Ramos",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte"
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Lucas",
        "document": "",
        "pronouns": "",
        "source": "Retorno ao consultório",
        "channel": "email",
        "permission": "allowed",
        "modality": "hybrid",
        "availability": "Dias úteis · 16:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_11",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_11",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_13",
      "name": "Mariana Castro Figueiredo",
      "birth": "1990-01-15",
      "phone": "",
      "email": "paciente13@example.invalid",
      "occupation": "Professora",
      "complaint": "Adaptação a mudanças na rotina.",
      "history": "Iniciou acompanhamento após mudança de trabalho e reorganização da rotina familiar.",
      "risk": "nenhum",
      "emergencyName": "Vítor Pereira Nascimento",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora"
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Mariana",
        "document": "",
        "pronouns": "",
        "source": "Indicação espontânea",
        "channel": "email",
        "permission": "allowed",
        "modality": "in_person",
        "availability": "Dias úteis · 08:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_12",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_12",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_14",
      "name": "Nicolas Freitas Cardoso",
      "birth": "1991-02-15",
      "phone": "",
      "email": "paciente14@example.invalid",
      "occupation": "Analista administrativo",
      "complaint": "Organização de demandas do trabalho.",
      "history": "Procura compreender as demandas profissionais e os limites na rotina.",
      "risk": "nenhum",
      "emergencyName": "Alice Carvalho Medeiros",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "reimbursement",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Nicolas",
        "document": "",
        "pronouns": "",
        "source": "Busca na internet",
        "channel": "email",
        "permission": "allowed",
        "modality": "online",
        "availability": "Dias úteis · 09:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Online"
        ],
        "contacts": [
          {
            "id": "demo_contact_13",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_13",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_15",
      "name": "Olívia Mendes Carvalho",
      "birth": "1992-03-15",
      "phone": "",
      "email": "paciente15@example.invalid",
      "occupation": "Designer",
      "complaint": "Comunicação e relações familiares.",
      "history": "Retoma o acompanhamento para elaborar mudanças recentes nas relações familiares.",
      "risk": "nenhum",
      "emergencyName": "Bernardo Melo Tavares",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "unspecified",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Olívia",
        "document": "",
        "pronouns": "",
        "source": "Indicação de profissional",
        "channel": "email",
        "permission": "allowed",
        "modality": "hybrid",
        "availability": "Dias úteis · 10:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_14",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_14",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_16",
      "name": "Paulo Henrique Lima",
      "birth": "1993-04-15",
      "phone": "",
      "email": "paciente16@example.invalid",
      "occupation": "Técnico de informática",
      "complaint": "Rotina de sono e autocuidado.",
      "history": "Relata dificuldade em equilibrar descanso, trabalho e compromissos pessoais.",
      "risk": "nenhum",
      "emergencyName": "Cecília Ramos Azevedo",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "private",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Paulo",
        "document": "",
        "pronouns": "",
        "source": "Retorno ao consultório",
        "channel": "email",
        "permission": "allowed",
        "modality": "in_person",
        "availability": "Dias úteis · 14:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_15",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_15",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_17",
      "name": "Rafaela Dias Monteiro",
      "birth": "1994-05-15",
      "phone": "",
      "email": "paciente17@example.invalid",
      "occupation": "Estudante",
      "complaint": "Transição acadêmica e profissional.",
      "history": "Está reorganizando planos de estudo e trabalho para o próximo semestre.",
      "risk": "nenhum",
      "emergencyName": "Daniela Lopes Ferreira",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte"
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Rafaela",
        "document": "",
        "pronouns": "",
        "source": "Indicação espontânea",
        "channel": "email",
        "permission": "allowed",
        "modality": "online",
        "availability": "Dias úteis · 15:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Online"
        ],
        "contacts": [
          {
            "id": "demo_contact_16",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_16",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_18",
      "name": "Samuel Cardoso Vieira",
      "birth": "1995-06-15",
      "phone": "",
      "email": "paciente18@example.invalid",
      "occupation": "Comerciante",
      "complaint": "Reconhecimento de emoções.",
      "history": "Busca compreender as emoções presentes em situações recorrentes do cotidiano.",
      "risk": "nenhum",
      "emergencyName": "Eduardo Farias Cunha",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora"
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Samuel",
        "document": "",
        "pronouns": "",
        "source": "Busca na internet",
        "channel": "email",
        "permission": "allowed",
        "modality": "hybrid",
        "availability": "Dias úteis · 16:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_17",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_17",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_19",
      "name": "Talita Moreira Ramos",
      "birth": "1996-07-15",
      "phone": "",
      "email": "paciente19@example.invalid",
      "occupation": "Professora",
      "complaint": "Adaptação a mudanças na rotina.",
      "history": "Iniciou acompanhamento após mudança de trabalho e reorganização da rotina familiar.",
      "risk": "nenhum",
      "emergencyName": "Fernanda Sales Rocha",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "reimbursement",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Talita",
        "document": "",
        "pronouns": "",
        "source": "Indicação de profissional",
        "channel": "email",
        "permission": "allowed",
        "modality": "in_person",
        "availability": "Dias úteis · 08:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_18",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_18",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_20",
      "name": "Vítor Pereira Nascimento",
      "birth": "1997-08-15",
      "phone": "",
      "email": "paciente20@example.invalid",
      "occupation": "Analista administrativo",
      "complaint": "Organização de demandas do trabalho.",
      "history": "Procura compreender as demandas profissionais e os limites na rotina.",
      "risk": "nenhum",
      "emergencyName": "Gustavo Pires Machado",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-31T12:00:00-03:00",
      "coverage": {
        "kind": "unspecified",
        "planId": ""
      },
      "crm": {
        "stage": "ongoing",
        "preferredName": "Vítor",
        "document": "",
        "pronouns": "",
        "source": "Retorno ao consultório",
        "channel": "email",
        "permission": "allowed",
        "modality": "online",
        "availability": "Dias úteis · 09:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Online"
        ],
        "contacts": [
          {
            "id": "demo_contact_19",
            "date": "2026-08-31",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-31T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_19",
            "from": "unclassified",
            "to": "ongoing",
            "date": "2026-08-31T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_21",
      "name": "Alice Carvalho Medeiros",
      "birth": "2010-09-15",
      "phone": "",
      "email": "paciente21@example.invalid",
      "occupation": "Estudante",
      "complaint": "Comunicação e relações familiares.",
      "history": "Retoma o acompanhamento para elaborar mudanças recentes nas relações familiares.",
      "risk": "atenção",
      "emergencyName": "Helena Moura Cavalcanti",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-10-18T12:00:00-03:00",
      "coverage": {
        "kind": "private",
        "planId": ""
      },
      "crm": {
        "stage": "assessment",
        "preferredName": "Alice",
        "document": "",
        "pronouns": "",
        "source": "Indicação espontânea",
        "channel": "email",
        "permission": "allowed",
        "modality": "hybrid",
        "availability": "Dias úteis · 10:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "Renata Carvalho Medeiros",
        "guardianRelationship": "Responsável legal",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adolescente",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_20",
            "date": "2026-10-18",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-10-18T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_20",
            "title": "Confirmar retorno do encaminhamento",
            "dueDate": "2026-11-07",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_20",
            "from": "unclassified",
            "to": "assessment",
            "date": "2026-10-18T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_22",
      "name": "Bernardo Melo Tavares",
      "birth": "1999-10-15",
      "phone": "",
      "email": "paciente22@example.invalid",
      "occupation": "Técnico de informática",
      "complaint": "Rotina de sono e autocuidado.",
      "history": "Relata dificuldade em equilibrar descanso, trabalho e compromissos pessoais.",
      "risk": "nenhum",
      "emergencyName": "Igor Batista Fonseca",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-10-18T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte"
      },
      "crm": {
        "stage": "assessment",
        "preferredName": "Bernardo",
        "document": "",
        "pronouns": "",
        "source": "Busca na internet",
        "channel": "email",
        "permission": "allowed",
        "modality": "in_person",
        "availability": "Dias úteis · 14:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_21",
            "date": "2026-10-18",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-10-18T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_21",
            "title": "Conferir disponibilidade para próxima sessão",
            "dueDate": "2026-11-02",
            "priority": "high",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_21",
            "from": "unclassified",
            "to": "assessment",
            "date": "2026-10-18T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_23",
      "name": "Cecília Ramos Azevedo",
      "birth": "2010-11-15",
      "phone": "",
      "email": "paciente23@example.invalid",
      "occupation": "Estudante",
      "complaint": "Transição acadêmica e profissional.",
      "history": "Está reorganizando planos de estudo e trabalho para o próximo semestre.",
      "risk": "nenhum",
      "emergencyName": "Juliana Neves Barbosa",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-10-18T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora"
      },
      "crm": {
        "stage": "assessment",
        "preferredName": "Cecília",
        "document": "",
        "pronouns": "",
        "source": "Indicação de profissional",
        "channel": "email",
        "permission": "allowed",
        "modality": "online",
        "availability": "Dias úteis · 15:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "Patrícia Ramos Azevedo",
        "guardianRelationship": "Responsável legal",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adolescente",
          "Online"
        ],
        "contacts": [
          {
            "id": "demo_contact_22",
            "date": "2026-10-18",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-10-18T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_22",
            "title": "Revisar dados administrativos",
            "dueDate": "2026-11-04",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_22",
            "from": "unclassified",
            "to": "assessment",
            "date": "2026-10-18T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_24",
      "name": "Daniela Lopes Ferreira",
      "birth": "2001-12-15",
      "phone": "",
      "email": "paciente24@example.invalid",
      "occupation": "Comerciante",
      "complaint": "Reconhecimento de emoções.",
      "history": "Busca compreender as emoções presentes em situações recorrentes do cotidiano.",
      "risk": "nenhum",
      "emergencyName": "Ana Clara Monteiro",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-10-18T12:00:00-03:00",
      "coverage": {
        "kind": "reimbursement",
        "planId": ""
      },
      "crm": {
        "stage": "assessment",
        "preferredName": "Daniela",
        "document": "",
        "pronouns": "",
        "source": "Retorno ao consultório",
        "channel": "email",
        "permission": "allowed",
        "modality": "hybrid",
        "availability": "Dias úteis · 16:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_23",
            "date": "2026-10-18",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-10-18T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_23",
            "title": "Confirmar retorno do encaminhamento",
            "dueDate": "2026-11-07",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_23",
            "from": "unclassified",
            "to": "assessment",
            "date": "2026-10-18T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_25",
      "name": "Eduardo Farias Cunha",
      "birth": "1978-01-15",
      "phone": "",
      "email": "paciente25@example.invalid",
      "occupation": "Professora",
      "complaint": "Adaptação a mudanças na rotina.",
      "history": "Iniciou acompanhamento após mudança de trabalho e reorganização da rotina familiar.",
      "risk": "nenhum",
      "emergencyName": "Bruno Henrique Azevedo",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-11-01T12:00:00-03:00",
      "coverage": {
        "kind": "unspecified",
        "planId": ""
      },
      "crm": {
        "stage": "intake",
        "preferredName": "Eduardo",
        "document": "",
        "pronouns": "",
        "source": "Indicação espontânea",
        "channel": "email",
        "permission": "allowed",
        "modality": "in_person",
        "availability": "Dias úteis · 08:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_24",
            "date": "2026-11-01",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_24",
            "title": "Conferir disponibilidade para próxima sessão",
            "dueDate": "2026-11-02",
            "priority": "high",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_24",
            "from": "unclassified",
            "to": "intake",
            "date": "2026-11-01T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_26",
      "name": "Fernanda Sales Rocha",
      "birth": "1979-02-15",
      "phone": "",
      "email": "paciente26@example.invalid",
      "occupation": "Analista administrativo",
      "complaint": "Organização de demandas do trabalho.",
      "history": "Procura compreender as demandas profissionais e os limites na rotina.",
      "risk": "nenhum",
      "emergencyName": "Camila Nogueira Batista",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-11-01T12:00:00-03:00",
      "coverage": {
        "kind": "private",
        "planId": ""
      },
      "crm": {
        "stage": "intake",
        "preferredName": "Fernanda",
        "document": "",
        "pronouns": "",
        "source": "Busca na internet",
        "channel": "email",
        "permission": "allowed",
        "modality": "online",
        "availability": "Dias úteis · 09:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Online"
        ],
        "contacts": [
          {
            "id": "demo_contact_25",
            "date": "2026-11-01",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_25",
            "title": "Revisar dados administrativos",
            "dueDate": "2026-11-04",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_25",
            "from": "unclassified",
            "to": "intake",
            "date": "2026-11-01T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_27",
      "name": "Gustavo Pires Machado",
      "birth": "1980-03-15",
      "phone": "",
      "email": "paciente27@example.invalid",
      "occupation": "Designer",
      "complaint": "Comunicação e relações familiares.",
      "history": "Retoma o acompanhamento para elaborar mudanças recentes nas relações familiares.",
      "risk": "nenhum",
      "emergencyName": "Diego Fernandes Ribeiro",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-26T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte"
      },
      "crm": {
        "stage": "paused",
        "preferredName": "Gustavo",
        "document": "",
        "pronouns": "",
        "source": "Indicação de profissional",
        "channel": "email",
        "permission": "allowed",
        "modality": "hybrid",
        "availability": "Dias úteis · 10:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_26",
            "date": "2026-08-26",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-26T12:00:00-03:00"
          }
        ],
        "tasks": [
          {
            "id": "demo_task_26",
            "title": "Confirmar retorno do encaminhamento",
            "dueDate": "2026-11-07",
            "priority": "normal",
            "status": "open",
            "createdAt": "2026-11-01T12:00:00-03:00"
          }
        ],
        "stageHistory": [
          {
            "id": "demo_stage_26",
            "from": "unclassified",
            "to": "paused",
            "date": "2026-08-26T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_28",
      "name": "Helena Moura Cavalcanti",
      "birth": "1981-04-15",
      "phone": "",
      "email": "paciente28@example.invalid",
      "occupation": "Técnico de informática",
      "complaint": "Rotina de sono e autocuidado.",
      "history": "Relata dificuldade em equilibrar descanso, trabalho e compromissos pessoais.",
      "risk": "nenhum",
      "emergencyName": "Elisa Martins Pacheco",
      "emergencyPhone": "",
      "archived": false,
      "createdAt": "2026-08-26T12:00:00-03:00",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora"
      },
      "crm": {
        "stage": "discharged",
        "preferredName": "Helena",
        "document": "",
        "pronouns": "",
        "source": "Retorno ao consultório",
        "channel": "email",
        "permission": "allowed",
        "modality": "in_person",
        "availability": "Dias úteis · 14:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_27",
            "date": "2026-08-26",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-26T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_27",
            "from": "unclassified",
            "to": "discharged",
            "date": "2026-08-26T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      }
    },
    {
      "id": "demo_patient_29",
      "name": "Igor Batista Fonseca",
      "birth": "1982-05-15",
      "phone": "",
      "email": "paciente29@example.invalid",
      "occupation": "Estudante",
      "complaint": "Transição acadêmica e profissional.",
      "history": "Está reorganizando planos de estudo e trabalho para o próximo semestre.",
      "risk": "nenhum",
      "emergencyName": "Felipe Andrade Torres",
      "emergencyPhone": "",
      "archived": true,
      "createdAt": "2026-08-26T12:00:00-03:00",
      "coverage": {
        "kind": "reimbursement",
        "planId": ""
      },
      "crm": {
        "stage": "discharged",
        "preferredName": "Igor",
        "document": "",
        "pronouns": "",
        "source": "Indicação espontânea",
        "channel": "email",
        "permission": "allowed",
        "modality": "online",
        "availability": "Dias úteis · 15:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Online"
        ],
        "contacts": [
          {
            "id": "demo_contact_28",
            "date": "2026-08-26",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-26T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_28",
            "from": "unclassified",
            "to": "discharged",
            "date": "2026-08-26T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      },
      "archivedAt": "2026-10-15T12:00:00-03:00"
    },
    {
      "id": "demo_patient_30",
      "name": "Juliana Neves Barbosa",
      "birth": "1983-06-15",
      "phone": "",
      "email": "paciente30@example.invalid",
      "occupation": "Comerciante",
      "complaint": "Reconhecimento de emoções.",
      "history": "Busca compreender as emoções presentes em situações recorrentes do cotidiano.",
      "risk": "nenhum",
      "emergencyName": "Gabriela Costa Moreira",
      "emergencyPhone": "",
      "archived": true,
      "createdAt": "2026-08-26T12:00:00-03:00",
      "coverage": {
        "kind": "unspecified",
        "planId": ""
      },
      "crm": {
        "stage": "discharged",
        "preferredName": "Juliana",
        "document": "",
        "pronouns": "",
        "source": "Busca na internet",
        "channel": "email",
        "permission": "allowed",
        "modality": "hybrid",
        "availability": "Dias úteis · 16:00",
        "address": "",
        "city": "São Paulo",
        "state": "SP",
        "guardianName": "",
        "guardianRelationship": "",
        "guardianPhone": "",
        "emergencyRelationship": "Familiar",
        "adminNotes": "Prefere organizar os retornos com antecedência.",
        "tags": [
          "Adulto",
          "Consultório"
        ],
        "contacts": [
          {
            "id": "demo_contact_29",
            "date": "2026-08-26",
            "channel": "email",
            "summary": "Acolhimento inicial",
            "note": "",
            "createdAt": "2026-08-26T12:00:00-03:00"
          }
        ],
        "tasks": [],
        "stageHistory": [
          {
            "id": "demo_stage_29",
            "from": "unclassified",
            "to": "discharged",
            "date": "2026-08-26T12:00:00-03:00",
            "reason": "Etapa definida no acolhimento inicial"
          }
        ]
      },
      "archivedAt": "2026-10-15T12:00:00-03:00"
    }
  ],
  "appointments": [
    {
      "id": "demo_appointment_20260909_0",
      "patientId": "demo_patient_13",
      "date": "2026-09-09",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-02T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260909_1",
      "patientId": "demo_patient_14",
      "date": "2026-09-09",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-02T12:00:00-03:00",
      "status": "cancelled"
    },
    {
      "id": "demo_appointment_20260909_2",
      "patientId": "demo_patient_15",
      "date": "2026-09-09",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-02T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260909_3",
      "patientId": "demo_patient_16",
      "date": "2026-09-09",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-02T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260909_4",
      "patientId": "demo_patient_17",
      "date": "2026-09-09",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-02T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260909_5",
      "patientId": "demo_patient_18",
      "date": "2026-09-09",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-02T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260910_0",
      "patientId": "demo_patient_19",
      "date": "2026-09-10",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-03T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260910_1",
      "patientId": "demo_patient_20",
      "date": "2026-09-10",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-03T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260911_2",
      "patientId": "demo_patient_27",
      "date": "2026-09-11",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-04T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260911_3",
      "patientId": "demo_patient_28",
      "date": "2026-09-11",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-04T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260911_4",
      "patientId": "demo_patient_29",
      "date": "2026-09-11",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-04T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260911_5",
      "patientId": "demo_patient_30",
      "date": "2026-09-11",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-04T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260914_0",
      "patientId": "demo_patient_01",
      "date": "2026-09-14",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260914_1",
      "patientId": "demo_patient_02",
      "date": "2026-09-14",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260914_2",
      "patientId": "demo_patient_03",
      "date": "2026-09-14",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260914_3",
      "patientId": "demo_patient_04",
      "date": "2026-09-14",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260914_4",
      "patientId": "demo_patient_05",
      "date": "2026-09-14",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260914_5",
      "patientId": "demo_patient_06",
      "date": "2026-09-14",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260915_0",
      "patientId": "demo_patient_07",
      "date": "2026-09-15",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-08T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260915_1",
      "patientId": "demo_patient_08",
      "date": "2026-09-15",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-08T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260915_2",
      "patientId": "demo_patient_09",
      "date": "2026-09-15",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-08T12:00:00-03:00",
      "status": "no_show"
    },
    {
      "id": "demo_appointment_20260915_3",
      "patientId": "demo_patient_10",
      "date": "2026-09-15",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-08T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260915_4",
      "patientId": "demo_patient_11",
      "date": "2026-09-15",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-08T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260915_5",
      "patientId": "demo_patient_12",
      "date": "2026-09-15",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-08T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260916_0",
      "patientId": "demo_patient_13",
      "date": "2026-09-16",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-09T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260916_1",
      "patientId": "demo_patient_14",
      "date": "2026-09-16",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-09T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260916_2",
      "patientId": "demo_patient_15",
      "date": "2026-09-16",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-09T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260916_3",
      "patientId": "demo_patient_16",
      "date": "2026-09-16",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-09T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260916_4",
      "patientId": "demo_patient_17",
      "date": "2026-09-16",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-09T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260916_5",
      "patientId": "demo_patient_18",
      "date": "2026-09-16",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-09T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260917_0",
      "patientId": "demo_patient_19",
      "date": "2026-09-17",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-10T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260917_1",
      "patientId": "demo_patient_20",
      "date": "2026-09-17",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-10T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260918_2",
      "patientId": "demo_patient_27",
      "date": "2026-09-18",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-11T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260918_3",
      "patientId": "demo_patient_28",
      "date": "2026-09-18",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-11T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260918_4",
      "patientId": "demo_patient_29",
      "date": "2026-09-18",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-11T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260918_5",
      "patientId": "demo_patient_30",
      "date": "2026-09-18",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-11T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260921_0",
      "patientId": "demo_patient_01",
      "date": "2026-09-21",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-14T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260921_1",
      "patientId": "demo_patient_02",
      "date": "2026-09-21",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-14T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260921_2",
      "patientId": "demo_patient_03",
      "date": "2026-09-21",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-14T12:00:00-03:00",
      "status": "cancelled"
    },
    {
      "id": "demo_appointment_20260921_3",
      "patientId": "demo_patient_04",
      "date": "2026-09-21",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-14T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260921_4",
      "patientId": "demo_patient_05",
      "date": "2026-09-21",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-14T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260921_5",
      "patientId": "demo_patient_06",
      "date": "2026-09-21",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-14T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260922_0",
      "patientId": "demo_patient_07",
      "date": "2026-09-22",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260922_1",
      "patientId": "demo_patient_08",
      "date": "2026-09-22",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260922_2",
      "patientId": "demo_patient_09",
      "date": "2026-09-22",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260922_3",
      "patientId": "demo_patient_10",
      "date": "2026-09-22",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260922_4",
      "patientId": "demo_patient_11",
      "date": "2026-09-22",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260922_5",
      "patientId": "demo_patient_12",
      "date": "2026-09-22",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260923_0",
      "patientId": "demo_patient_13",
      "date": "2026-09-23",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-16T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260923_1",
      "patientId": "demo_patient_14",
      "date": "2026-09-23",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-16T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260923_2",
      "patientId": "demo_patient_15",
      "date": "2026-09-23",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-16T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260923_3",
      "patientId": "demo_patient_16",
      "date": "2026-09-23",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-16T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260923_4",
      "patientId": "demo_patient_17",
      "date": "2026-09-23",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-16T12:00:00-03:00",
      "status": "no_show"
    },
    {
      "id": "demo_appointment_20260923_5",
      "patientId": "demo_patient_18",
      "date": "2026-09-23",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-16T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260924_0",
      "patientId": "demo_patient_19",
      "date": "2026-09-24",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-17T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260924_1",
      "patientId": "demo_patient_20",
      "date": "2026-09-24",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-17T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260925_2",
      "patientId": "demo_patient_27",
      "date": "2026-09-25",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-18T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260925_3",
      "patientId": "demo_patient_28",
      "date": "2026-09-25",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-18T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260925_4",
      "patientId": "demo_patient_29",
      "date": "2026-09-25",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-18T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260925_5",
      "patientId": "demo_patient_30",
      "date": "2026-09-25",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-18T12:00:00-03:00",
      "status": "cancelled"
    },
    {
      "id": "demo_appointment_20260928_0",
      "patientId": "demo_patient_01",
      "date": "2026-09-28",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260928_1",
      "patientId": "demo_patient_02",
      "date": "2026-09-28",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260928_2",
      "patientId": "demo_patient_03",
      "date": "2026-09-28",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260928_3",
      "patientId": "demo_patient_04",
      "date": "2026-09-28",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260928_4",
      "patientId": "demo_patient_05",
      "date": "2026-09-28",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260928_5",
      "patientId": "demo_patient_06",
      "date": "2026-09-28",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260929_0",
      "patientId": "demo_patient_07",
      "date": "2026-09-29",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-22T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260929_1",
      "patientId": "demo_patient_08",
      "date": "2026-09-29",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-22T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260929_2",
      "patientId": "demo_patient_09",
      "date": "2026-09-29",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-22T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260929_3",
      "patientId": "demo_patient_10",
      "date": "2026-09-29",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-22T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260929_4",
      "patientId": "demo_patient_11",
      "date": "2026-09-29",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-22T12:00:00-03:00",
      "status": "cancelled"
    },
    {
      "id": "demo_appointment_20260929_5",
      "patientId": "demo_patient_12",
      "date": "2026-09-29",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-22T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260930_0",
      "patientId": "demo_patient_13",
      "date": "2026-09-30",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-23T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260930_1",
      "patientId": "demo_patient_14",
      "date": "2026-09-30",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-23T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260930_2",
      "patientId": "demo_patient_15",
      "date": "2026-09-30",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-23T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260930_3",
      "patientId": "demo_patient_16",
      "date": "2026-09-30",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-23T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260930_4",
      "patientId": "demo_patient_17",
      "date": "2026-09-30",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-23T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20260930_5",
      "patientId": "demo_patient_18",
      "date": "2026-09-30",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-23T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261001_0",
      "patientId": "demo_patient_19",
      "date": "2026-10-01",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-24T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261001_1",
      "patientId": "demo_patient_20",
      "date": "2026-10-01",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-24T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261002_2",
      "patientId": "demo_patient_27",
      "date": "2026-10-02",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-25T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261002_3",
      "patientId": "demo_patient_28",
      "date": "2026-10-02",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-25T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261002_4",
      "patientId": "demo_patient_29",
      "date": "2026-10-02",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-25T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261002_5",
      "patientId": "demo_patient_30",
      "date": "2026-10-02",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-25T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261005_0",
      "patientId": "demo_patient_01",
      "date": "2026-10-05",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-28T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261005_1",
      "patientId": "demo_patient_02",
      "date": "2026-10-05",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-28T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261005_2",
      "patientId": "demo_patient_03",
      "date": "2026-10-05",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-28T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261005_3",
      "patientId": "demo_patient_04",
      "date": "2026-10-05",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-28T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261005_4",
      "patientId": "demo_patient_05",
      "date": "2026-10-05",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-28T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261005_5",
      "patientId": "demo_patient_06",
      "date": "2026-10-05",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-28T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261006_0",
      "patientId": "demo_patient_07",
      "date": "2026-10-06",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-29T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261006_1",
      "patientId": "demo_patient_08",
      "date": "2026-10-06",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-29T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261006_2",
      "patientId": "demo_patient_09",
      "date": "2026-10-06",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-29T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261006_3",
      "patientId": "demo_patient_10",
      "date": "2026-10-06",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-29T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261006_4",
      "patientId": "demo_patient_11",
      "date": "2026-10-06",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-29T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261006_5",
      "patientId": "demo_patient_12",
      "date": "2026-10-06",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-29T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261007_0",
      "patientId": "demo_patient_13",
      "date": "2026-10-07",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-30T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261007_1",
      "patientId": "demo_patient_14",
      "date": "2026-10-07",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-30T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261007_2",
      "patientId": "demo_patient_15",
      "date": "2026-10-07",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-30T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261007_3",
      "patientId": "demo_patient_16",
      "date": "2026-10-07",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-30T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261007_4",
      "patientId": "demo_patient_17",
      "date": "2026-10-07",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-09-30T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261007_5",
      "patientId": "demo_patient_18",
      "date": "2026-10-07",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-09-30T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261008_0",
      "patientId": "demo_patient_19",
      "date": "2026-10-08",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-01T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261008_1",
      "patientId": "demo_patient_20",
      "date": "2026-10-08",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-01T12:00:00-03:00",
      "status": "cancelled"
    },
    {
      "id": "demo_appointment_20261009_2",
      "patientId": "demo_patient_27",
      "date": "2026-10-09",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-02T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261009_3",
      "patientId": "demo_patient_28",
      "date": "2026-10-09",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-02T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261009_4",
      "patientId": "demo_patient_29",
      "date": "2026-10-09",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-02T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261009_5",
      "patientId": "demo_patient_30",
      "date": "2026-10-09",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-02T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261013_0",
      "patientId": "demo_patient_07",
      "date": "2026-10-13",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-06T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261013_1",
      "patientId": "demo_patient_08",
      "date": "2026-10-13",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-06T12:00:00-03:00",
      "status": "no_show"
    },
    {
      "id": "demo_appointment_20261013_2",
      "patientId": "demo_patient_09",
      "date": "2026-10-13",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-06T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261013_3",
      "patientId": "demo_patient_10",
      "date": "2026-10-13",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-06T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261013_4",
      "patientId": "demo_patient_11",
      "date": "2026-10-13",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-06T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261013_5",
      "patientId": "demo_patient_12",
      "date": "2026-10-13",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-06T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261014_0",
      "patientId": "demo_patient_13",
      "date": "2026-10-14",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261014_1",
      "patientId": "demo_patient_14",
      "date": "2026-10-14",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261014_2",
      "patientId": "demo_patient_15",
      "date": "2026-10-14",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261014_3",
      "patientId": "demo_patient_16",
      "date": "2026-10-14",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261014_4",
      "patientId": "demo_patient_17",
      "date": "2026-10-14",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261014_5",
      "patientId": "demo_patient_18",
      "date": "2026-10-14",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-07T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261015_0",
      "patientId": "demo_patient_19",
      "date": "2026-10-15",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-08T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261015_1",
      "patientId": "demo_patient_20",
      "date": "2026-10-15",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-08T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261019_0",
      "patientId": "demo_patient_01",
      "date": "2026-10-19",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-12T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261019_1",
      "patientId": "demo_patient_02",
      "date": "2026-10-19",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-12T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261019_2",
      "patientId": "demo_patient_03",
      "date": "2026-10-19",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-12T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261019_3",
      "patientId": "demo_patient_04",
      "date": "2026-10-19",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-12T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261019_4",
      "patientId": "demo_patient_05",
      "date": "2026-10-19",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-12T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261019_5",
      "patientId": "demo_patient_06",
      "date": "2026-10-19",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-12T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261020_0",
      "patientId": "demo_patient_07",
      "date": "2026-10-20",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-13T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261020_1",
      "patientId": "demo_patient_08",
      "date": "2026-10-20",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-13T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261020_2",
      "patientId": "demo_patient_09",
      "date": "2026-10-20",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-13T12:00:00-03:00",
      "status": "cancelled"
    },
    {
      "id": "demo_appointment_20261020_3",
      "patientId": "demo_patient_10",
      "date": "2026-10-20",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-13T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261020_4",
      "patientId": "demo_patient_11",
      "date": "2026-10-20",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-13T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261020_5",
      "patientId": "demo_patient_12",
      "date": "2026-10-20",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-13T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261021_0",
      "patientId": "demo_patient_13",
      "date": "2026-10-21",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-14T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261021_1",
      "patientId": "demo_patient_14",
      "date": "2026-10-21",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-14T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261021_2",
      "patientId": "demo_patient_15",
      "date": "2026-10-21",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-14T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261021_3",
      "patientId": "demo_patient_16",
      "date": "2026-10-21",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-14T12:00:00-03:00",
      "status": "no_show"
    },
    {
      "id": "demo_appointment_20261021_4",
      "patientId": "demo_patient_17",
      "date": "2026-10-21",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-14T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261021_5",
      "patientId": "demo_patient_18",
      "date": "2026-10-21",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-14T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261022_0",
      "patientId": "demo_patient_19",
      "date": "2026-10-22",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261022_1",
      "patientId": "demo_patient_20",
      "date": "2026-10-22",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261022_2",
      "patientId": "demo_patient_21",
      "date": "2026-10-22",
      "time": "10:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261022_3",
      "patientId": "demo_patient_22",
      "date": "2026-10-22",
      "time": "14:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261022_4",
      "patientId": "demo_patient_23",
      "date": "2026-10-22",
      "time": "15:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261022_5",
      "patientId": "demo_patient_24",
      "date": "2026-10-22",
      "time": "16:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-15T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261026_0",
      "patientId": "demo_patient_01",
      "date": "2026-10-26",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-19T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261026_1",
      "patientId": "demo_patient_02",
      "date": "2026-10-26",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-19T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261026_2",
      "patientId": "demo_patient_03",
      "date": "2026-10-26",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-19T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261026_3",
      "patientId": "demo_patient_04",
      "date": "2026-10-26",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-19T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261026_4",
      "patientId": "demo_patient_05",
      "date": "2026-10-26",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-19T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261026_5",
      "patientId": "demo_patient_06",
      "date": "2026-10-26",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-19T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261027_0",
      "patientId": "demo_patient_07",
      "date": "2026-10-27",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-20T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261027_1",
      "patientId": "demo_patient_08",
      "date": "2026-10-27",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-20T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261027_2",
      "patientId": "demo_patient_09",
      "date": "2026-10-27",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-20T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261027_3",
      "patientId": "demo_patient_10",
      "date": "2026-10-27",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-20T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261027_4",
      "patientId": "demo_patient_11",
      "date": "2026-10-27",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-20T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261027_5",
      "patientId": "demo_patient_12",
      "date": "2026-10-27",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-20T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261028_0",
      "patientId": "demo_patient_13",
      "date": "2026-10-28",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261028_1",
      "patientId": "demo_patient_14",
      "date": "2026-10-28",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261028_2",
      "patientId": "demo_patient_15",
      "date": "2026-10-28",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261028_3",
      "patientId": "demo_patient_16",
      "date": "2026-10-28",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261028_4",
      "patientId": "demo_patient_17",
      "date": "2026-10-28",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-21T12:00:00-03:00",
      "status": "cancelled"
    },
    {
      "id": "demo_appointment_20261028_5",
      "patientId": "demo_patient_18",
      "date": "2026-10-28",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-21T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261029_0",
      "patientId": "demo_patient_19",
      "date": "2026-10-29",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-22T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261029_1",
      "patientId": "demo_patient_20",
      "date": "2026-10-29",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-22T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261029_2",
      "patientId": "demo_patient_21",
      "date": "2026-10-29",
      "time": "10:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-22T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261029_3",
      "patientId": "demo_patient_22",
      "date": "2026-10-29",
      "time": "14:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-22T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261029_4",
      "patientId": "demo_patient_23",
      "date": "2026-10-29",
      "time": "15:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-22T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261029_5",
      "patientId": "demo_patient_24",
      "date": "2026-10-29",
      "time": "16:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-22T12:00:00-03:00",
      "status": "no_show"
    },
    {
      "id": "demo_appointment_20261103_0",
      "patientId": "demo_patient_07",
      "date": "2026-11-03",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-27T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261103_1",
      "patientId": "demo_patient_08",
      "date": "2026-11-03",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-27T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261103_2",
      "patientId": "demo_patient_09",
      "date": "2026-11-03",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-27T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261103_3",
      "patientId": "demo_patient_10",
      "date": "2026-11-03",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-27T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261103_4",
      "patientId": "demo_patient_11",
      "date": "2026-11-03",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-27T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261103_5",
      "patientId": "demo_patient_12",
      "date": "2026-11-03",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-27T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261104_0",
      "patientId": "demo_patient_13",
      "date": "2026-11-04",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-28T12:00:00-03:00",
      "status": "completed"
    },
    {
      "id": "demo_appointment_20261104_1",
      "patientId": "demo_patient_14",
      "date": "2026-11-04",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-28T12:00:00-03:00",
      "status": "no_show"
    },
    {
      "id": "demo_appointment_20261104_2",
      "patientId": "demo_patient_15",
      "date": "2026-11-04",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-28T12:00:00-03:00",
      "status": "cancelled"
    },
    {
      "id": "demo_appointment_20261104_3",
      "patientId": "demo_patient_16",
      "date": "2026-11-04",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-28T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261104_4",
      "patientId": "demo_patient_17",
      "date": "2026-11-04",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-28T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261104_5",
      "patientId": "demo_patient_18",
      "date": "2026-11-04",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-28T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261105_0",
      "patientId": "demo_patient_19",
      "date": "2026-11-05",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-29T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261105_1",
      "patientId": "demo_patient_20",
      "date": "2026-11-05",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-29T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261105_2",
      "patientId": "demo_patient_21",
      "date": "2026-11-05",
      "time": "10:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-29T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261105_3",
      "patientId": "demo_patient_22",
      "date": "2026-11-05",
      "time": "14:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-29T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261105_4",
      "patientId": "demo_patient_23",
      "date": "2026-11-05",
      "time": "15:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-29T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261105_5",
      "patientId": "demo_patient_24",
      "date": "2026-11-05",
      "time": "16:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-29T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261106_0",
      "patientId": "demo_patient_25",
      "date": "2026-11-06",
      "time": "08:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-10-30T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261106_1",
      "patientId": "demo_patient_26",
      "date": "2026-11-06",
      "time": "09:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-10-30T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261109_0",
      "patientId": "demo_patient_01",
      "date": "2026-11-09",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-02T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261109_1",
      "patientId": "demo_patient_02",
      "date": "2026-11-09",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-02T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261109_2",
      "patientId": "demo_patient_03",
      "date": "2026-11-09",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-02T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261109_3",
      "patientId": "demo_patient_04",
      "date": "2026-11-09",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-02T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261109_4",
      "patientId": "demo_patient_05",
      "date": "2026-11-09",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-02T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261109_5",
      "patientId": "demo_patient_06",
      "date": "2026-11-09",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-02T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261110_0",
      "patientId": "demo_patient_07",
      "date": "2026-11-10",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261110_1",
      "patientId": "demo_patient_08",
      "date": "2026-11-10",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261110_2",
      "patientId": "demo_patient_09",
      "date": "2026-11-10",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261110_3",
      "patientId": "demo_patient_10",
      "date": "2026-11-10",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261110_4",
      "patientId": "demo_patient_11",
      "date": "2026-11-10",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261110_5",
      "patientId": "demo_patient_12",
      "date": "2026-11-10",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261111_0",
      "patientId": "demo_patient_13",
      "date": "2026-11-11",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261111_1",
      "patientId": "demo_patient_14",
      "date": "2026-11-11",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261111_2",
      "patientId": "demo_patient_15",
      "date": "2026-11-11",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261111_3",
      "patientId": "demo_patient_16",
      "date": "2026-11-11",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261111_4",
      "patientId": "demo_patient_17",
      "date": "2026-11-11",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261111_5",
      "patientId": "demo_patient_18",
      "date": "2026-11-11",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261112_0",
      "patientId": "demo_patient_19",
      "date": "2026-11-12",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261112_1",
      "patientId": "demo_patient_20",
      "date": "2026-11-12",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261112_2",
      "patientId": "demo_patient_21",
      "date": "2026-11-12",
      "time": "10:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261112_3",
      "patientId": "demo_patient_22",
      "date": "2026-11-12",
      "time": "14:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261112_4",
      "patientId": "demo_patient_23",
      "date": "2026-11-12",
      "time": "15:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261112_5",
      "patientId": "demo_patient_24",
      "date": "2026-11-12",
      "time": "16:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261113_0",
      "patientId": "demo_patient_25",
      "date": "2026-11-13",
      "time": "08:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261113_1",
      "patientId": "demo_patient_26",
      "date": "2026-11-13",
      "time": "09:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261116_0",
      "patientId": "demo_patient_01",
      "date": "2026-11-16",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261116_1",
      "patientId": "demo_patient_02",
      "date": "2026-11-16",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261116_2",
      "patientId": "demo_patient_03",
      "date": "2026-11-16",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261116_3",
      "patientId": "demo_patient_04",
      "date": "2026-11-16",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261116_4",
      "patientId": "demo_patient_05",
      "date": "2026-11-16",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261116_5",
      "patientId": "demo_patient_06",
      "date": "2026-11-16",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261117_0",
      "patientId": "demo_patient_07",
      "date": "2026-11-17",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261117_1",
      "patientId": "demo_patient_08",
      "date": "2026-11-17",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261117_2",
      "patientId": "demo_patient_09",
      "date": "2026-11-17",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261117_3",
      "patientId": "demo_patient_10",
      "date": "2026-11-17",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261117_4",
      "patientId": "demo_patient_11",
      "date": "2026-11-17",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261117_5",
      "patientId": "demo_patient_12",
      "date": "2026-11-17",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261118_0",
      "patientId": "demo_patient_13",
      "date": "2026-11-18",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261118_1",
      "patientId": "demo_patient_14",
      "date": "2026-11-18",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261118_2",
      "patientId": "demo_patient_15",
      "date": "2026-11-18",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261118_3",
      "patientId": "demo_patient_16",
      "date": "2026-11-18",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261118_4",
      "patientId": "demo_patient_17",
      "date": "2026-11-18",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261118_5",
      "patientId": "demo_patient_18",
      "date": "2026-11-18",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261119_0",
      "patientId": "demo_patient_19",
      "date": "2026-11-19",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261119_1",
      "patientId": "demo_patient_20",
      "date": "2026-11-19",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261119_2",
      "patientId": "demo_patient_21",
      "date": "2026-11-19",
      "time": "10:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261119_3",
      "patientId": "demo_patient_22",
      "date": "2026-11-19",
      "time": "14:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261119_4",
      "patientId": "demo_patient_23",
      "date": "2026-11-19",
      "time": "15:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261119_5",
      "patientId": "demo_patient_24",
      "date": "2026-11-19",
      "time": "16:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261123_0",
      "patientId": "demo_patient_01",
      "date": "2026-11-23",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261123_1",
      "patientId": "demo_patient_02",
      "date": "2026-11-23",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261123_2",
      "patientId": "demo_patient_03",
      "date": "2026-11-23",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261123_3",
      "patientId": "demo_patient_04",
      "date": "2026-11-23",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261123_4",
      "patientId": "demo_patient_05",
      "date": "2026-11-23",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261123_5",
      "patientId": "demo_patient_06",
      "date": "2026-11-23",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261124_0",
      "patientId": "demo_patient_07",
      "date": "2026-11-24",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261124_1",
      "patientId": "demo_patient_08",
      "date": "2026-11-24",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261124_2",
      "patientId": "demo_patient_09",
      "date": "2026-11-24",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261124_3",
      "patientId": "demo_patient_10",
      "date": "2026-11-24",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261124_4",
      "patientId": "demo_patient_11",
      "date": "2026-11-24",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261124_5",
      "patientId": "demo_patient_12",
      "date": "2026-11-24",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261125_0",
      "patientId": "demo_patient_13",
      "date": "2026-11-25",
      "time": "08:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261125_1",
      "patientId": "demo_patient_14",
      "date": "2026-11-25",
      "time": "09:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261125_2",
      "patientId": "demo_patient_15",
      "date": "2026-11-25",
      "time": "10:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261125_3",
      "patientId": "demo_patient_16",
      "date": "2026-11-25",
      "time": "14:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 140,
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "confirmed"
    },
    {
      "id": "demo_appointment_20261125_4",
      "patientId": "demo_patient_17",
      "date": "2026-11-25",
      "time": "15:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "notes": "Atendimento online.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_20261125_5",
      "patientId": "demo_patient_18",
      "date": "2026-11-25",
      "time": "16:00",
      "duration": 50,
      "type": "acompanhamento",
      "fee": 180,
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "notes": "Atendimento presencial.",
      "createdAt": "2026-11-03T12:00:00-03:00",
      "status": "scheduled"
    },
    {
      "id": "demo_appointment_today_late",
      "patientId": "demo_patient_25",
      "date": "2026-11-04",
      "time": "19:00",
      "duration": 50,
      "type": "avaliacao",
      "fee": 180,
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "notes": "Primeiro atendimento no fim do expediente.",
      "status": "scheduled"
    }
  ],
  "sessions": [
    {
      "id": "demo_session_demo_appointment_20260909_0",
      "patientId": "demo_patient_13",
      "appointmentId": "demo_appointment_20260909_0",
      "date": "2026-09-09",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-09T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260909_2",
      "patientId": "demo_patient_15",
      "appointmentId": "demo_appointment_20260909_2",
      "date": "2026-09-09",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-09T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260909_3",
      "patientId": "demo_patient_16",
      "appointmentId": "demo_appointment_20260909_3",
      "date": "2026-09-09",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-09T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260909_4",
      "patientId": "demo_patient_17",
      "appointmentId": "demo_appointment_20260909_4",
      "date": "2026-09-09",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-09T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260909_5",
      "patientId": "demo_patient_18",
      "appointmentId": "demo_appointment_20260909_5",
      "date": "2026-09-09",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-09T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260910_0",
      "patientId": "demo_patient_19",
      "appointmentId": "demo_appointment_20260910_0",
      "date": "2026-09-10",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-10T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260910_1",
      "patientId": "demo_patient_20",
      "appointmentId": "demo_appointment_20260910_1",
      "date": "2026-09-10",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-10T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260911_2",
      "patientId": "demo_patient_27",
      "appointmentId": "demo_appointment_20260911_2",
      "date": "2026-09-11",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-11T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260911_3",
      "patientId": "demo_patient_28",
      "appointmentId": "demo_appointment_20260911_3",
      "date": "2026-09-11",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-11T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260911_4",
      "patientId": "demo_patient_29",
      "appointmentId": "demo_appointment_20260911_4",
      "date": "2026-09-11",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-11T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260911_5",
      "patientId": "demo_patient_30",
      "appointmentId": "demo_appointment_20260911_5",
      "date": "2026-09-11",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_29",
        "objectiveIds": [
          "demo_objective_29_1"
        ]
      },
      "createdAt": "2026-09-11T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260914_0",
      "patientId": "demo_patient_01",
      "appointmentId": "demo_appointment_20260914_0",
      "date": "2026-09-14",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-14T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "packageId": "demo_pack_0",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260914_1",
      "patientId": "demo_patient_02",
      "appointmentId": "demo_appointment_20260914_1",
      "date": "2026-09-14",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-14T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_1",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260914_2",
      "patientId": "demo_patient_03",
      "appointmentId": "demo_appointment_20260914_2",
      "date": "2026-09-14",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-14T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_2",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260914_3",
      "patientId": "demo_patient_04",
      "appointmentId": "demo_appointment_20260914_3",
      "date": "2026-09-14",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-14T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_3",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260914_4",
      "patientId": "demo_patient_05",
      "appointmentId": "demo_appointment_20260914_4",
      "date": "2026-09-14",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-14T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_4",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260914_5",
      "patientId": "demo_patient_06",
      "appointmentId": "demo_appointment_20260914_5",
      "date": "2026-09-14",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-14T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "packageId": "demo_pack_5",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260915_0",
      "patientId": "demo_patient_07",
      "appointmentId": "demo_appointment_20260915_0",
      "date": "2026-09-15",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-15T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_6",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260915_1",
      "patientId": "demo_patient_08",
      "appointmentId": "demo_appointment_20260915_1",
      "date": "2026-09-15",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-15T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_7",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260915_3",
      "patientId": "demo_patient_10",
      "appointmentId": "demo_appointment_20260915_3",
      "date": "2026-09-15",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-15T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_9",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260915_4",
      "patientId": "demo_patient_11",
      "appointmentId": "demo_appointment_20260915_4",
      "date": "2026-09-15",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-15T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260915_5",
      "patientId": "demo_patient_12",
      "appointmentId": "demo_appointment_20260915_5",
      "date": "2026-09-15",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-15T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260916_0",
      "patientId": "demo_patient_13",
      "appointmentId": "demo_appointment_20260916_0",
      "date": "2026-09-16",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-16T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260916_1",
      "patientId": "demo_patient_14",
      "appointmentId": "demo_appointment_20260916_1",
      "date": "2026-09-16",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-16T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260916_2",
      "patientId": "demo_patient_15",
      "appointmentId": "demo_appointment_20260916_2",
      "date": "2026-09-16",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-16T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260916_3",
      "patientId": "demo_patient_16",
      "appointmentId": "demo_appointment_20260916_3",
      "date": "2026-09-16",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-16T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260916_4",
      "patientId": "demo_patient_17",
      "appointmentId": "demo_appointment_20260916_4",
      "date": "2026-09-16",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-16T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260916_5",
      "patientId": "demo_patient_18",
      "appointmentId": "demo_appointment_20260916_5",
      "date": "2026-09-16",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-16T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260917_0",
      "patientId": "demo_patient_19",
      "appointmentId": "demo_appointment_20260917_0",
      "date": "2026-09-17",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-17T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260917_1",
      "patientId": "demo_patient_20",
      "appointmentId": "demo_appointment_20260917_1",
      "date": "2026-09-17",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-17T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260918_2",
      "patientId": "demo_patient_27",
      "appointmentId": "demo_appointment_20260918_2",
      "date": "2026-09-18",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_26",
        "objectiveIds": [
          "demo_objective_26_1"
        ]
      },
      "createdAt": "2026-09-18T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260918_3",
      "patientId": "demo_patient_28",
      "appointmentId": "demo_appointment_20260918_3",
      "date": "2026-09-18",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_27",
        "objectiveIds": [
          "demo_objective_27_1"
        ]
      },
      "createdAt": "2026-09-18T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260918_4",
      "patientId": "demo_patient_29",
      "appointmentId": "demo_appointment_20260918_4",
      "date": "2026-09-18",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_28",
        "objectiveIds": [
          "demo_objective_28_1"
        ]
      },
      "createdAt": "2026-09-18T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260918_5",
      "patientId": "demo_patient_30",
      "appointmentId": "demo_appointment_20260918_5",
      "date": "2026-09-18",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_29",
        "objectiveIds": [
          "demo_objective_29_1"
        ]
      },
      "createdAt": "2026-09-18T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260921_0",
      "patientId": "demo_patient_01",
      "appointmentId": "demo_appointment_20260921_0",
      "date": "2026-09-21",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-21T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "packageId": "demo_pack_0",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260921_1",
      "patientId": "demo_patient_02",
      "appointmentId": "demo_appointment_20260921_1",
      "date": "2026-09-21",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-21T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_1",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260921_3",
      "patientId": "demo_patient_04",
      "appointmentId": "demo_appointment_20260921_3",
      "date": "2026-09-21",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-21T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_3",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260921_4",
      "patientId": "demo_patient_05",
      "appointmentId": "demo_appointment_20260921_4",
      "date": "2026-09-21",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-21T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_4",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260921_5",
      "patientId": "demo_patient_06",
      "appointmentId": "demo_appointment_20260921_5",
      "date": "2026-09-21",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-21T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "packageId": "demo_pack_5",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260922_0",
      "patientId": "demo_patient_07",
      "appointmentId": "demo_appointment_20260922_0",
      "date": "2026-09-22",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-22T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_6",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260922_1",
      "patientId": "demo_patient_08",
      "appointmentId": "demo_appointment_20260922_1",
      "date": "2026-09-22",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-22T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_7",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260922_2",
      "patientId": "demo_patient_09",
      "appointmentId": "demo_appointment_20260922_2",
      "date": "2026-09-22",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-22T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_8",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260922_3",
      "patientId": "demo_patient_10",
      "appointmentId": "demo_appointment_20260922_3",
      "date": "2026-09-22",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-22T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_9",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260922_4",
      "patientId": "demo_patient_11",
      "appointmentId": "demo_appointment_20260922_4",
      "date": "2026-09-22",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-22T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260922_5",
      "patientId": "demo_patient_12",
      "appointmentId": "demo_appointment_20260922_5",
      "date": "2026-09-22",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-22T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260923_0",
      "patientId": "demo_patient_13",
      "appointmentId": "demo_appointment_20260923_0",
      "date": "2026-09-23",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-23T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260923_1",
      "patientId": "demo_patient_14",
      "appointmentId": "demo_appointment_20260923_1",
      "date": "2026-09-23",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-23T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260923_2",
      "patientId": "demo_patient_15",
      "appointmentId": "demo_appointment_20260923_2",
      "date": "2026-09-23",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-23T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260923_3",
      "patientId": "demo_patient_16",
      "appointmentId": "demo_appointment_20260923_3",
      "date": "2026-09-23",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-23T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260923_5",
      "patientId": "demo_patient_18",
      "appointmentId": "demo_appointment_20260923_5",
      "date": "2026-09-23",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-23T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260924_0",
      "patientId": "demo_patient_19",
      "appointmentId": "demo_appointment_20260924_0",
      "date": "2026-09-24",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-24T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260924_1",
      "patientId": "demo_patient_20",
      "appointmentId": "demo_appointment_20260924_1",
      "date": "2026-09-24",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-24T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260925_2",
      "patientId": "demo_patient_27",
      "appointmentId": "demo_appointment_20260925_2",
      "date": "2026-09-25",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_26",
        "objectiveIds": [
          "demo_objective_26_1"
        ]
      },
      "createdAt": "2026-09-25T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260925_3",
      "patientId": "demo_patient_28",
      "appointmentId": "demo_appointment_20260925_3",
      "date": "2026-09-25",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_27",
        "objectiveIds": [
          "demo_objective_27_1"
        ]
      },
      "createdAt": "2026-09-25T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260925_4",
      "patientId": "demo_patient_29",
      "appointmentId": "demo_appointment_20260925_4",
      "date": "2026-09-25",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_28",
        "objectiveIds": [
          "demo_objective_28_1"
        ]
      },
      "createdAt": "2026-09-25T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260928_0",
      "patientId": "demo_patient_01",
      "appointmentId": "demo_appointment_20260928_0",
      "date": "2026-09-28",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_0",
        "objectiveIds": [
          "demo_objective_0_1"
        ]
      },
      "createdAt": "2026-09-28T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "packageId": "demo_pack_0",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260928_1",
      "patientId": "demo_patient_02",
      "appointmentId": "demo_appointment_20260928_1",
      "date": "2026-09-28",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_1",
        "objectiveIds": [
          "demo_objective_1_1"
        ]
      },
      "createdAt": "2026-09-28T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_1",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260928_2",
      "patientId": "demo_patient_03",
      "appointmentId": "demo_appointment_20260928_2",
      "date": "2026-09-28",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_2",
        "objectiveIds": [
          "demo_objective_2_1"
        ]
      },
      "createdAt": "2026-09-28T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_2",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260928_3",
      "patientId": "demo_patient_04",
      "appointmentId": "demo_appointment_20260928_3",
      "date": "2026-09-28",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_3",
        "objectiveIds": [
          "demo_objective_3_1"
        ]
      },
      "createdAt": "2026-09-28T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_3",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260928_4",
      "patientId": "demo_patient_05",
      "appointmentId": "demo_appointment_20260928_4",
      "date": "2026-09-28",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_4",
        "objectiveIds": [
          "demo_objective_4_1"
        ]
      },
      "createdAt": "2026-09-28T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_4",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260928_5",
      "patientId": "demo_patient_06",
      "appointmentId": "demo_appointment_20260928_5",
      "date": "2026-09-28",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_5",
        "objectiveIds": [
          "demo_objective_5_1"
        ]
      },
      "createdAt": "2026-09-28T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "packageId": "demo_pack_5",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260929_0",
      "patientId": "demo_patient_07",
      "appointmentId": "demo_appointment_20260929_0",
      "date": "2026-09-29",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-29T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_6",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260929_1",
      "patientId": "demo_patient_08",
      "appointmentId": "demo_appointment_20260929_1",
      "date": "2026-09-29",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-29T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_7",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260929_2",
      "patientId": "demo_patient_09",
      "appointmentId": "demo_appointment_20260929_2",
      "date": "2026-09-29",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-29T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_8",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260929_3",
      "patientId": "demo_patient_10",
      "appointmentId": "demo_appointment_20260929_3",
      "date": "2026-09-29",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-29T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_9",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20260929_5",
      "patientId": "demo_patient_12",
      "appointmentId": "demo_appointment_20260929_5",
      "date": "2026-09-29",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-29T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260930_0",
      "patientId": "demo_patient_13",
      "appointmentId": "demo_appointment_20260930_0",
      "date": "2026-09-30",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-30T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260930_1",
      "patientId": "demo_patient_14",
      "appointmentId": "demo_appointment_20260930_1",
      "date": "2026-09-30",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-30T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260930_2",
      "patientId": "demo_patient_15",
      "appointmentId": "demo_appointment_20260930_2",
      "date": "2026-09-30",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-30T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260930_3",
      "patientId": "demo_patient_16",
      "appointmentId": "demo_appointment_20260930_3",
      "date": "2026-09-30",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_15",
        "objectiveIds": [
          "demo_objective_15_1"
        ]
      },
      "createdAt": "2026-09-30T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260930_4",
      "patientId": "demo_patient_17",
      "appointmentId": "demo_appointment_20260930_4",
      "date": "2026-09-30",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_16",
        "objectiveIds": [
          "demo_objective_16_1"
        ]
      },
      "createdAt": "2026-09-30T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20260930_5",
      "patientId": "demo_patient_18",
      "appointmentId": "demo_appointment_20260930_5",
      "date": "2026-09-30",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-09-30T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261001_0",
      "patientId": "demo_patient_19",
      "appointmentId": "demo_appointment_20261001_0",
      "date": "2026-10-01",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-10-01T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261001_1",
      "patientId": "demo_patient_20",
      "appointmentId": "demo_appointment_20261001_1",
      "date": "2026-10-01",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_19",
        "objectiveIds": [
          "demo_objective_19_1"
        ]
      },
      "createdAt": "2026-10-01T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261002_2",
      "patientId": "demo_patient_27",
      "appointmentId": "demo_appointment_20261002_2",
      "date": "2026-10-02",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_26",
        "objectiveIds": [
          "demo_objective_26_1"
        ]
      },
      "createdAt": "2026-10-02T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261002_3",
      "patientId": "demo_patient_28",
      "appointmentId": "demo_appointment_20261002_3",
      "date": "2026-10-02",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_27",
        "objectiveIds": [
          "demo_objective_27_1"
        ]
      },
      "createdAt": "2026-10-02T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261002_4",
      "patientId": "demo_patient_29",
      "appointmentId": "demo_appointment_20261002_4",
      "date": "2026-10-02",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_28",
        "objectiveIds": [
          "demo_objective_28_1"
        ]
      },
      "createdAt": "2026-10-02T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261002_5",
      "patientId": "demo_patient_30",
      "appointmentId": "demo_appointment_20261002_5",
      "date": "2026-10-02",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_29",
        "objectiveIds": [
          "demo_objective_29_1"
        ]
      },
      "createdAt": "2026-10-02T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261005_0",
      "patientId": "demo_patient_01",
      "appointmentId": "demo_appointment_20261005_0",
      "date": "2026-10-05",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_0",
        "objectiveIds": [
          "demo_objective_0_1"
        ]
      },
      "createdAt": "2026-10-05T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "packageId": "demo_pack_0",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261005_1",
      "patientId": "demo_patient_02",
      "appointmentId": "demo_appointment_20261005_1",
      "date": "2026-10-05",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_1",
        "objectiveIds": [
          "demo_objective_1_1"
        ]
      },
      "createdAt": "2026-10-05T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_1",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261005_2",
      "patientId": "demo_patient_03",
      "appointmentId": "demo_appointment_20261005_2",
      "date": "2026-10-05",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_2",
        "objectiveIds": [
          "demo_objective_2_1"
        ]
      },
      "createdAt": "2026-10-05T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_2",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261005_3",
      "patientId": "demo_patient_04",
      "appointmentId": "demo_appointment_20261005_3",
      "date": "2026-10-05",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_3",
        "objectiveIds": [
          "demo_objective_3_1"
        ]
      },
      "createdAt": "2026-10-05T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_3",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261005_4",
      "patientId": "demo_patient_05",
      "appointmentId": "demo_appointment_20261005_4",
      "date": "2026-10-05",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_4",
        "objectiveIds": [
          "demo_objective_4_1"
        ]
      },
      "createdAt": "2026-10-05T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_4",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261005_5",
      "patientId": "demo_patient_06",
      "appointmentId": "demo_appointment_20261005_5",
      "date": "2026-10-05",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_5",
        "objectiveIds": [
          "demo_objective_5_1"
        ]
      },
      "createdAt": "2026-10-05T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "packageId": "demo_pack_5",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261006_0",
      "patientId": "demo_patient_07",
      "appointmentId": "demo_appointment_20261006_0",
      "date": "2026-10-06",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-10-06T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_6",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261006_1",
      "patientId": "demo_patient_08",
      "appointmentId": "demo_appointment_20261006_1",
      "date": "2026-10-06",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_7",
        "objectiveIds": [
          "demo_objective_7_1"
        ]
      },
      "createdAt": "2026-10-06T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_7",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261006_2",
      "patientId": "demo_patient_09",
      "appointmentId": "demo_appointment_20261006_2",
      "date": "2026-10-06",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_8",
        "objectiveIds": [
          "demo_objective_8_1"
        ]
      },
      "createdAt": "2026-10-06T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_8",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261006_3",
      "patientId": "demo_patient_10",
      "appointmentId": "demo_appointment_20261006_3",
      "date": "2026-10-06",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-10-06T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_9",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261006_4",
      "patientId": "demo_patient_11",
      "appointmentId": "demo_appointment_20261006_4",
      "date": "2026-10-06",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-10-06T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261006_5",
      "patientId": "demo_patient_12",
      "appointmentId": "demo_appointment_20261006_5",
      "date": "2026-10-06",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-10-06T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261007_0",
      "patientId": "demo_patient_13",
      "appointmentId": "demo_appointment_20261007_0",
      "date": "2026-10-07",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão."
      },
      "createdAt": "2026-10-07T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261007_1",
      "patientId": "demo_patient_14",
      "appointmentId": "demo_appointment_20261007_1",
      "date": "2026-10-07",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_13",
        "objectiveIds": [
          "demo_objective_13_1"
        ]
      },
      "createdAt": "2026-10-07T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261007_2",
      "patientId": "demo_patient_15",
      "appointmentId": "demo_appointment_20261007_2",
      "date": "2026-10-07",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_14",
        "objectiveIds": [
          "demo_objective_14_1"
        ]
      },
      "createdAt": "2026-10-07T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261007_3",
      "patientId": "demo_patient_16",
      "appointmentId": "demo_appointment_20261007_3",
      "date": "2026-10-07",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_15",
        "objectiveIds": [
          "demo_objective_15_1"
        ]
      },
      "createdAt": "2026-10-07T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261007_4",
      "patientId": "demo_patient_17",
      "appointmentId": "demo_appointment_20261007_4",
      "date": "2026-10-07",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_16",
        "objectiveIds": [
          "demo_objective_16_1"
        ]
      },
      "createdAt": "2026-10-07T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261007_5",
      "patientId": "demo_patient_18",
      "appointmentId": "demo_appointment_20261007_5",
      "date": "2026-10-07",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_17",
        "objectiveIds": [
          "demo_objective_17_1"
        ]
      },
      "createdAt": "2026-10-07T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261008_0",
      "patientId": "demo_patient_19",
      "appointmentId": "demo_appointment_20261008_0",
      "date": "2026-10-08",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_18",
        "objectiveIds": [
          "demo_objective_18_1"
        ]
      },
      "createdAt": "2026-10-08T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261009_2",
      "patientId": "demo_patient_27",
      "appointmentId": "demo_appointment_20261009_2",
      "date": "2026-10-09",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_26",
        "objectiveIds": [
          "demo_objective_26_1"
        ]
      },
      "createdAt": "2026-10-09T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261009_3",
      "patientId": "demo_patient_28",
      "appointmentId": "demo_appointment_20261009_3",
      "date": "2026-10-09",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_27",
        "objectiveIds": [
          "demo_objective_27_1"
        ]
      },
      "createdAt": "2026-10-09T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261009_4",
      "patientId": "demo_patient_29",
      "appointmentId": "demo_appointment_20261009_4",
      "date": "2026-10-09",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_28",
        "objectiveIds": [
          "demo_objective_28_1"
        ]
      },
      "createdAt": "2026-10-09T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261009_5",
      "patientId": "demo_patient_30",
      "appointmentId": "demo_appointment_20261009_5",
      "date": "2026-10-09",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_29",
        "objectiveIds": [
          "demo_objective_29_1"
        ]
      },
      "createdAt": "2026-10-09T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261013_0",
      "patientId": "demo_patient_07",
      "appointmentId": "demo_appointment_20261013_0",
      "date": "2026-10-13",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_6",
        "objectiveIds": [
          "demo_objective_6_1"
        ]
      },
      "createdAt": "2026-10-13T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_6",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261013_2",
      "patientId": "demo_patient_09",
      "appointmentId": "demo_appointment_20261013_2",
      "date": "2026-10-13",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_8",
        "objectiveIds": [
          "demo_objective_8_1"
        ]
      },
      "createdAt": "2026-10-13T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_8",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261013_3",
      "patientId": "demo_patient_10",
      "appointmentId": "demo_appointment_20261013_3",
      "date": "2026-10-13",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_9",
        "objectiveIds": [
          "demo_objective_9_1"
        ]
      },
      "createdAt": "2026-10-13T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_9",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261013_4",
      "patientId": "demo_patient_11",
      "appointmentId": "demo_appointment_20261013_4",
      "date": "2026-10-13",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_10",
        "objectiveIds": [
          "demo_objective_10_1"
        ]
      },
      "createdAt": "2026-10-13T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261013_5",
      "patientId": "demo_patient_12",
      "appointmentId": "demo_appointment_20261013_5",
      "date": "2026-10-13",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_11",
        "objectiveIds": [
          "demo_objective_11_1"
        ]
      },
      "createdAt": "2026-10-13T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261014_0",
      "patientId": "demo_patient_13",
      "appointmentId": "demo_appointment_20261014_0",
      "date": "2026-10-14",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_12",
        "objectiveIds": [
          "demo_objective_12_1"
        ]
      },
      "createdAt": "2026-10-14T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261014_1",
      "patientId": "demo_patient_14",
      "appointmentId": "demo_appointment_20261014_1",
      "date": "2026-10-14",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_13",
        "objectiveIds": [
          "demo_objective_13_1"
        ]
      },
      "createdAt": "2026-10-14T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261014_2",
      "patientId": "demo_patient_15",
      "appointmentId": "demo_appointment_20261014_2",
      "date": "2026-10-14",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_14",
        "objectiveIds": [
          "demo_objective_14_1"
        ]
      },
      "createdAt": "2026-10-14T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261014_3",
      "patientId": "demo_patient_16",
      "appointmentId": "demo_appointment_20261014_3",
      "date": "2026-10-14",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_15",
        "objectiveIds": [
          "demo_objective_15_1"
        ]
      },
      "createdAt": "2026-10-14T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261014_4",
      "patientId": "demo_patient_17",
      "appointmentId": "demo_appointment_20261014_4",
      "date": "2026-10-14",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_16",
        "objectiveIds": [
          "demo_objective_16_1"
        ]
      },
      "createdAt": "2026-10-14T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261014_5",
      "patientId": "demo_patient_18",
      "appointmentId": "demo_appointment_20261014_5",
      "date": "2026-10-14",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_17",
        "objectiveIds": [
          "demo_objective_17_1"
        ]
      },
      "createdAt": "2026-10-14T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261015_0",
      "patientId": "demo_patient_19",
      "appointmentId": "demo_appointment_20261015_0",
      "date": "2026-10-15",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_18",
        "objectiveIds": [
          "demo_objective_18_1"
        ]
      },
      "createdAt": "2026-10-15T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261015_1",
      "patientId": "demo_patient_20",
      "appointmentId": "demo_appointment_20261015_1",
      "date": "2026-10-15",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_19",
        "objectiveIds": [
          "demo_objective_19_1"
        ]
      },
      "createdAt": "2026-10-15T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261019_0",
      "patientId": "demo_patient_01",
      "appointmentId": "demo_appointment_20261019_0",
      "date": "2026-10-19",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_0",
        "objectiveIds": [
          "demo_objective_0_1"
        ]
      },
      "createdAt": "2026-10-19T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261019_1",
      "patientId": "demo_patient_02",
      "appointmentId": "demo_appointment_20261019_1",
      "date": "2026-10-19",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_1",
        "objectiveIds": [
          "demo_objective_1_1"
        ]
      },
      "createdAt": "2026-10-19T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261019_2",
      "patientId": "demo_patient_03",
      "appointmentId": "demo_appointment_20261019_2",
      "date": "2026-10-19",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_2",
        "objectiveIds": [
          "demo_objective_2_1"
        ]
      },
      "createdAt": "2026-10-19T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_2",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261019_3",
      "patientId": "demo_patient_04",
      "appointmentId": "demo_appointment_20261019_3",
      "date": "2026-10-19",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_3",
        "objectiveIds": [
          "demo_objective_3_1"
        ]
      },
      "createdAt": "2026-10-19T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_3",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261019_4",
      "patientId": "demo_patient_05",
      "appointmentId": "demo_appointment_20261019_4",
      "date": "2026-10-19",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_4",
        "objectiveIds": [
          "demo_objective_4_1"
        ]
      },
      "createdAt": "2026-10-19T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_4",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261019_5",
      "patientId": "demo_patient_06",
      "appointmentId": "demo_appointment_20261019_5",
      "date": "2026-10-19",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_5",
        "objectiveIds": [
          "demo_objective_5_1"
        ]
      },
      "createdAt": "2026-10-19T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "packageId": "demo_pack_5",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261020_0",
      "patientId": "demo_patient_07",
      "appointmentId": "demo_appointment_20261020_0",
      "date": "2026-10-20",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_6",
        "objectiveIds": [
          "demo_objective_6_1"
        ]
      },
      "createdAt": "2026-10-20T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_6",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261020_1",
      "patientId": "demo_patient_08",
      "appointmentId": "demo_appointment_20261020_1",
      "date": "2026-10-20",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_7",
        "objectiveIds": [
          "demo_objective_7_1"
        ]
      },
      "createdAt": "2026-10-20T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_7",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261020_3",
      "patientId": "demo_patient_10",
      "appointmentId": "demo_appointment_20261020_3",
      "date": "2026-10-20",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_9",
        "objectiveIds": [
          "demo_objective_9_1"
        ]
      },
      "createdAt": "2026-10-20T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_9",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261020_4",
      "patientId": "demo_patient_11",
      "appointmentId": "demo_appointment_20261020_4",
      "date": "2026-10-20",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_10",
        "objectiveIds": [
          "demo_objective_10_1"
        ]
      },
      "createdAt": "2026-10-20T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261020_5",
      "patientId": "demo_patient_12",
      "appointmentId": "demo_appointment_20261020_5",
      "date": "2026-10-20",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_11",
        "objectiveIds": [
          "demo_objective_11_1"
        ]
      },
      "createdAt": "2026-10-20T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261021_0",
      "patientId": "demo_patient_13",
      "appointmentId": "demo_appointment_20261021_0",
      "date": "2026-10-21",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_12",
        "objectiveIds": [
          "demo_objective_12_1"
        ]
      },
      "createdAt": "2026-10-21T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261021_1",
      "patientId": "demo_patient_14",
      "appointmentId": "demo_appointment_20261021_1",
      "date": "2026-10-21",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_13",
        "objectiveIds": [
          "demo_objective_13_1"
        ]
      },
      "createdAt": "2026-10-21T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261021_2",
      "patientId": "demo_patient_15",
      "appointmentId": "demo_appointment_20261021_2",
      "date": "2026-10-21",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_14",
        "objectiveIds": [
          "demo_objective_14_1"
        ]
      },
      "createdAt": "2026-10-21T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261021_4",
      "patientId": "demo_patient_17",
      "appointmentId": "demo_appointment_20261021_4",
      "date": "2026-10-21",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_16",
        "objectiveIds": [
          "demo_objective_16_1"
        ]
      },
      "createdAt": "2026-10-21T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261021_5",
      "patientId": "demo_patient_18",
      "appointmentId": "demo_appointment_20261021_5",
      "date": "2026-10-21",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_17",
        "objectiveIds": [
          "demo_objective_17_1"
        ]
      },
      "createdAt": "2026-10-21T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261022_0",
      "patientId": "demo_patient_19",
      "appointmentId": "demo_appointment_20261022_0",
      "date": "2026-10-22",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_18",
        "objectiveIds": [
          "demo_objective_18_1"
        ]
      },
      "createdAt": "2026-10-22T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261022_1",
      "patientId": "demo_patient_20",
      "appointmentId": "demo_appointment_20261022_1",
      "date": "2026-10-22",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_19",
        "objectiveIds": [
          "demo_objective_19_1"
        ]
      },
      "createdAt": "2026-10-22T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261022_2",
      "patientId": "demo_patient_21",
      "appointmentId": "demo_appointment_20261022_2",
      "date": "2026-10-22",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_20",
        "objectiveIds": [
          "demo_objective_20_1"
        ]
      },
      "createdAt": "2026-10-22T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261022_3",
      "patientId": "demo_patient_22",
      "appointmentId": "demo_appointment_20261022_3",
      "date": "2026-10-22",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_21",
        "objectiveIds": [
          "demo_objective_21_1"
        ]
      },
      "createdAt": "2026-10-22T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261022_4",
      "patientId": "demo_patient_23",
      "appointmentId": "demo_appointment_20261022_4",
      "date": "2026-10-22",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_22",
        "objectiveIds": [
          "demo_objective_22_1"
        ]
      },
      "createdAt": "2026-10-22T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261022_5",
      "patientId": "demo_patient_24",
      "appointmentId": "demo_appointment_20261022_5",
      "date": "2026-10-22",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_23",
        "objectiveIds": [
          "demo_objective_23_1"
        ]
      },
      "createdAt": "2026-10-22T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261026_0",
      "patientId": "demo_patient_01",
      "appointmentId": "demo_appointment_20261026_0",
      "date": "2026-10-26",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_0",
        "objectiveIds": [
          "demo_objective_0_1"
        ]
      },
      "createdAt": "2026-10-26T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261026_1",
      "patientId": "demo_patient_02",
      "appointmentId": "demo_appointment_20261026_1",
      "date": "2026-10-26",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_1",
        "objectiveIds": [
          "demo_objective_1_1"
        ]
      },
      "createdAt": "2026-10-26T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261026_2",
      "patientId": "demo_patient_03",
      "appointmentId": "demo_appointment_20261026_2",
      "date": "2026-10-26",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_2",
        "objectiveIds": [
          "demo_objective_2_1"
        ]
      },
      "createdAt": "2026-10-26T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261026_3",
      "patientId": "demo_patient_04",
      "appointmentId": "demo_appointment_20261026_3",
      "date": "2026-10-26",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_3",
        "objectiveIds": [
          "demo_objective_3_1"
        ]
      },
      "createdAt": "2026-10-26T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_3",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261026_4",
      "patientId": "demo_patient_05",
      "appointmentId": "demo_appointment_20261026_4",
      "date": "2026-10-26",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_4",
        "objectiveIds": [
          "demo_objective_4_1"
        ]
      },
      "createdAt": "2026-10-26T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_4",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261026_5",
      "patientId": "demo_patient_06",
      "appointmentId": "demo_appointment_20261026_5",
      "date": "2026-10-26",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_5",
        "objectiveIds": [
          "demo_objective_5_1"
        ]
      },
      "createdAt": "2026-10-26T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "packageId": "demo_pack_5",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261027_0",
      "patientId": "demo_patient_07",
      "appointmentId": "demo_appointment_20261027_0",
      "date": "2026-10-27",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_6",
        "objectiveIds": [
          "demo_objective_6_1"
        ]
      },
      "createdAt": "2026-10-27T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_6",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261027_1",
      "patientId": "demo_patient_08",
      "appointmentId": "demo_appointment_20261027_1",
      "date": "2026-10-27",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_7",
        "objectiveIds": [
          "demo_objective_7_1"
        ]
      },
      "createdAt": "2026-10-27T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_7",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261027_2",
      "patientId": "demo_patient_09",
      "appointmentId": "demo_appointment_20261027_2",
      "date": "2026-10-27",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_8",
        "objectiveIds": [
          "demo_objective_8_1"
        ]
      },
      "createdAt": "2026-10-27T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "packageId": "demo_pack_8",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261027_3",
      "patientId": "demo_patient_10",
      "appointmentId": "demo_appointment_20261027_3",
      "date": "2026-10-27",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_9",
        "objectiveIds": [
          "demo_objective_9_1"
        ]
      },
      "createdAt": "2026-10-27T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_9",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261027_4",
      "patientId": "demo_patient_11",
      "appointmentId": "demo_appointment_20261027_4",
      "date": "2026-10-27",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_10",
        "objectiveIds": [
          "demo_objective_10_1"
        ]
      },
      "createdAt": "2026-10-27T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261027_5",
      "patientId": "demo_patient_12",
      "appointmentId": "demo_appointment_20261027_5",
      "date": "2026-10-27",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_11",
        "objectiveIds": [
          "demo_objective_11_1"
        ]
      },
      "createdAt": "2026-10-27T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261028_0",
      "patientId": "demo_patient_13",
      "appointmentId": "demo_appointment_20261028_0",
      "date": "2026-10-28",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_12",
        "objectiveIds": [
          "demo_objective_12_1"
        ]
      },
      "createdAt": "2026-10-28T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261028_1",
      "patientId": "demo_patient_14",
      "appointmentId": "demo_appointment_20261028_1",
      "date": "2026-10-28",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_13",
        "objectiveIds": [
          "demo_objective_13_1"
        ]
      },
      "createdAt": "2026-10-28T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261028_2",
      "patientId": "demo_patient_15",
      "appointmentId": "demo_appointment_20261028_2",
      "date": "2026-10-28",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_14",
        "objectiveIds": [
          "demo_objective_14_1"
        ]
      },
      "createdAt": "2026-10-28T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261028_3",
      "patientId": "demo_patient_16",
      "appointmentId": "demo_appointment_20261028_3",
      "date": "2026-10-28",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_15",
        "objectiveIds": [
          "demo_objective_15_1"
        ]
      },
      "createdAt": "2026-10-28T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261028_5",
      "patientId": "demo_patient_18",
      "appointmentId": "demo_appointment_20261028_5",
      "date": "2026-10-28",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_17",
        "objectiveIds": [
          "demo_objective_17_1"
        ]
      },
      "createdAt": "2026-10-28T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261029_0",
      "patientId": "demo_patient_19",
      "appointmentId": "demo_appointment_20261029_0",
      "date": "2026-10-29",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_18",
        "objectiveIds": [
          "demo_objective_18_1"
        ]
      },
      "createdAt": "2026-10-29T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261029_1",
      "patientId": "demo_patient_20",
      "appointmentId": "demo_appointment_20261029_1",
      "date": "2026-10-29",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_19",
        "objectiveIds": [
          "demo_objective_19_1"
        ]
      },
      "createdAt": "2026-10-29T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261029_2",
      "patientId": "demo_patient_21",
      "appointmentId": "demo_appointment_20261029_2",
      "date": "2026-10-29",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_20",
        "objectiveIds": [
          "demo_objective_20_1"
        ]
      },
      "createdAt": "2026-10-29T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261029_3",
      "patientId": "demo_patient_22",
      "appointmentId": "demo_appointment_20261029_3",
      "date": "2026-10-29",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_21",
        "objectiveIds": [
          "demo_objective_21_1"
        ]
      },
      "createdAt": "2026-10-29T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261029_4",
      "patientId": "demo_patient_23",
      "appointmentId": "demo_appointment_20261029_4",
      "date": "2026-10-29",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_22",
        "objectiveIds": [
          "demo_objective_22_1"
        ]
      },
      "createdAt": "2026-10-29T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261103_0",
      "patientId": "demo_patient_07",
      "appointmentId": "demo_appointment_20261103_0",
      "date": "2026-11-03",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_6",
        "objectiveIds": [
          "demo_objective_6_1"
        ]
      },
      "createdAt": "2026-11-03T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "packageId": "demo_pack_6",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261103_1",
      "patientId": "demo_patient_08",
      "appointmentId": "demo_appointment_20261103_1",
      "date": "2026-11-03",
      "content": "Sessão de acompanhamento sobre organização de demandas do trabalho. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Organização de demandas do trabalho",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_7",
        "objectiveIds": [
          "demo_objective_7_1"
        ]
      },
      "createdAt": "2026-11-03T09:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "packageId": "demo_pack_7",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261103_2",
      "patientId": "demo_patient_09",
      "appointmentId": "demo_appointment_20261103_2",
      "date": "2026-11-03",
      "content": "Sessão de acompanhamento sobre comunicação e relações familiares. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Comunicação e relações familiares",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_8",
        "objectiveIds": [
          "demo_objective_8_1"
        ]
      },
      "createdAt": "2026-11-03T10:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261103_3",
      "patientId": "demo_patient_10",
      "appointmentId": "demo_appointment_20261103_3",
      "date": "2026-11-03",
      "content": "Sessão de acompanhamento sobre rotina de sono e autocuidado. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Diferenciou expectativas pessoais e demandas externas ao revisar os acontecimentos da semana.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Rotina de sono e autocuidado",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_9",
        "objectiveIds": [
          "demo_objective_9_1"
        ]
      },
      "createdAt": "2026-11-03T14:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "packageId": "demo_pack_9",
      "billingMode": "package"
    },
    {
      "id": "demo_session_demo_appointment_20261103_4",
      "patientId": "demo_patient_11",
      "appointmentId": "demo_appointment_20261103_4",
      "date": "2026-11-03",
      "content": "Sessão de acompanhamento sobre transição acadêmica e profissional. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Compartilhou mudanças nas relações e dificuldades para expressar necessidades.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Estável",
      "adherence": "Boa",
      "evolution": {
        "modality": "online",
        "duration": 50,
        "focus": "Transição acadêmica e profissional",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_10",
        "objectiveIds": [
          "demo_objective_10_1"
        ]
      },
      "createdAt": "2026-11-03T15:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261103_5",
      "patientId": "demo_patient_12",
      "appointmentId": "demo_appointment_20261103_5",
      "date": "2026-11-03",
      "content": "Sessão de acompanhamento sobre reconhecimento de emoções. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Revisou pequenas mudanças percebidas em relação ao início do acompanhamento.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Preocupação relatada",
      "adherence": "Boa",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Reconhecimento de emoções",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_11",
        "objectiveIds": [
          "demo_objective_11_1"
        ]
      },
      "createdAt": "2026-11-03T16:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "billingMode": "single"
    },
    {
      "id": "demo_session_demo_appointment_20261104_0",
      "patientId": "demo_patient_13",
      "appointmentId": "demo_appointment_20261104_0",
      "date": "2026-11-04",
      "content": "Sessão de acompanhamento sobre adaptação a mudanças na rotina. A pessoa descreveu acontecimentos recentes e retomou os pontos combinados na sessão anterior. Trouxe uma situação recente e descreveu como percebeu suas próprias reações.",
      "interventions": "Escuta do relato, exploração do contexto apresentado e revisão dos objetivos do acompanhamento.",
      "nextPlan": "Retomar os objetivos do plano e revisar os registros no próximo encontro.",
      "mood": "Mais disposto",
      "adherence": "Parcial",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "Adaptação a mudanças na rotina",
        "objectives": "Acompanhar o objetivo descrito no plano terapêutico.",
        "homework": "Registrar situações que gostaria de retomar no próximo encontro, conforme combinado em sessão.",
        "treatmentId": "demo_treatment_12",
        "objectiveIds": [
          "demo_objective_12_1"
        ]
      },
      "createdAt": "2026-11-04T08:00:00-03:00",
      "revisionReason": "",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "billingMode": "single"
    }
  ],
  "treatments": [
    {
      "id": "demo_treatment_0",
      "patientId": "demo_patient_01",
      "plan": {
        "title": "Adaptação a mudanças na rotina",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-03",
        "endDate": "",
        "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_0_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.065Z"
          },
          {
            "id": "demo_objective_0_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.067Z"
          },
          {
            "id": "demo_objective_0_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.068Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260928_0",
          "demo_session_demo_appointment_20261005_0",
          "demo_session_demo_appointment_20261019_0",
          "demo_session_demo_appointment_20261026_0"
        ],
        "history": [
          {
            "id": "demo_auto_176",
            "date": "2026-11-04T21:56:43.065Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_01",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_177",
            "date": "2026-11-04T21:56:43.067Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_01",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_0_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.065Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_178",
            "date": "2026-11-04T21:56:43.068Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_01",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_0_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.065Z"
                  },
                  {
                    "id": "demo_objective_0_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.067Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_179",
            "date": "2026-11-04T21:56:43.070Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_01",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_0_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.065Z"
                  },
                  {
                    "id": "demo_objective_0_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.067Z"
                  },
                  {
                    "id": "demo_objective_0_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.068Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.063Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "fenomenologica",
      "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "quinzenal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.070Z"
    },
    {
      "id": "demo_treatment_1",
      "patientId": "demo_patient_02",
      "plan": {
        "title": "Organização de demandas do trabalho",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_1_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.073Z"
          },
          {
            "id": "demo_objective_1_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.074Z"
          },
          {
            "id": "demo_objective_1_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.076Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260928_1",
          "demo_session_demo_appointment_20261005_1",
          "demo_session_demo_appointment_20261019_1",
          "demo_session_demo_appointment_20261026_1"
        ],
        "history": [
          {
            "id": "demo_auto_180",
            "date": "2026-11-04T21:56:43.073Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_02",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_181",
            "date": "2026-11-04T21:56:43.074Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_02",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_1_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.073Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_182",
            "date": "2026-11-04T21:56:43.076Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_02",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_1_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.073Z"
                  },
                  {
                    "id": "demo_objective_1_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.074Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_183",
            "date": "2026-11-04T21:56:43.077Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_02",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_1_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.073Z"
                  },
                  {
                    "id": "demo_objective_1_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.074Z"
                  },
                  {
                    "id": "demo_objective_1_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.076Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.071Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "tcc",
      "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.077Z"
    },
    {
      "id": "demo_treatment_2",
      "patientId": "demo_patient_03",
      "plan": {
        "title": "Comunicação e relações familiares",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Psicanálise. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_2_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.080Z"
          },
          {
            "id": "demo_objective_2_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.082Z"
          },
          {
            "id": "demo_objective_2_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.083Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260928_2",
          "demo_session_demo_appointment_20261005_2",
          "demo_session_demo_appointment_20261019_2",
          "demo_session_demo_appointment_20261026_2"
        ],
        "history": [
          {
            "id": "demo_auto_184",
            "date": "2026-11-04T21:56:43.080Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_03",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicanalise",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicanálise. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_185",
            "date": "2026-11-04T21:56:43.082Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_03",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicanalise",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicanálise. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_2_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.080Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_186",
            "date": "2026-11-04T21:56:43.083Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_03",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicanalise",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicanálise. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_2_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.080Z"
                  },
                  {
                    "id": "demo_objective_2_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.082Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_187",
            "date": "2026-11-04T21:56:43.085Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_03",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicanalise",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicanálise. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_2_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.080Z"
                  },
                  {
                    "id": "demo_objective_2_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.082Z"
                  },
                  {
                    "id": "demo_objective_2_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.083Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.079Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "psicanalise",
      "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.085Z"
    },
    {
      "id": "demo_treatment_3",
      "patientId": "demo_patient_04",
      "plan": {
        "title": "Rotina de sono e autocuidado",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Humanista. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_3_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.088Z"
          },
          {
            "id": "demo_objective_3_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.089Z"
          },
          {
            "id": "demo_objective_3_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.091Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260928_3",
          "demo_session_demo_appointment_20261005_3",
          "demo_session_demo_appointment_20261019_3",
          "demo_session_demo_appointment_20261026_3"
        ],
        "history": [
          {
            "id": "demo_auto_188",
            "date": "2026-11-04T21:56:43.088Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_04",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "humanista",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Humanista. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_189",
            "date": "2026-11-04T21:56:43.089Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_04",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "humanista",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Humanista. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_3_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.088Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_190",
            "date": "2026-11-04T21:56:43.091Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_04",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "humanista",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Humanista. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_3_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.088Z"
                  },
                  {
                    "id": "demo_objective_3_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.089Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_191",
            "date": "2026-11-04T21:56:43.093Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_04",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "humanista",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Humanista. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_3_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.088Z"
                  },
                  {
                    "id": "demo_objective_3_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.089Z"
                  },
                  {
                    "id": "demo_objective_3_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.091Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.086Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "humanista",
      "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.093Z"
    },
    {
      "id": "demo_treatment_4",
      "patientId": "demo_patient_05",
      "plan": {
        "title": "Transição acadêmica e profissional",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-03",
        "endDate": "",
        "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_4_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.096Z"
          },
          {
            "id": "demo_objective_4_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.097Z"
          },
          {
            "id": "demo_objective_4_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.099Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260928_4",
          "demo_session_demo_appointment_20261005_4",
          "demo_session_demo_appointment_20261019_4",
          "demo_session_demo_appointment_20261026_4"
        ],
        "history": [
          {
            "id": "demo_auto_192",
            "date": "2026-11-04T21:56:43.096Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_05",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_193",
            "date": "2026-11-04T21:56:43.097Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_05",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_4_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.096Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_194",
            "date": "2026-11-04T21:56:43.099Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_05",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_4_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.096Z"
                  },
                  {
                    "id": "demo_objective_4_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.097Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_195",
            "date": "2026-11-04T21:56:43.102Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_05",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_4_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.096Z"
                  },
                  {
                    "id": "demo_objective_4_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.097Z"
                  },
                  {
                    "id": "demo_objective_4_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.099Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.094Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "gestalt",
      "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.102Z"
    },
    {
      "id": "demo_treatment_5",
      "patientId": "demo_patient_06",
      "plan": {
        "title": "Reconhecimento de emoções",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_5_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.105Z"
          },
          {
            "id": "demo_objective_5_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.107Z"
          },
          {
            "id": "demo_objective_5_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.109Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260928_5",
          "demo_session_demo_appointment_20261005_5",
          "demo_session_demo_appointment_20261019_5",
          "demo_session_demo_appointment_20261026_5"
        ],
        "history": [
          {
            "id": "demo_auto_196",
            "date": "2026-11-04T21:56:43.105Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_06",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_197",
            "date": "2026-11-04T21:56:43.107Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_06",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_5_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.105Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_198",
            "date": "2026-11-04T21:56:43.109Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_06",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_5_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.105Z"
                  },
                  {
                    "id": "demo_objective_5_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.107Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_199",
            "date": "2026-11-04T21:56:43.111Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_06",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_5_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.105Z"
                  },
                  {
                    "id": "demo_objective_5_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.107Z"
                  },
                  {
                    "id": "demo_objective_5_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.109Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.104Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "sistêmica",
      "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "quinzenal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.111Z"
    },
    {
      "id": "demo_treatment_6",
      "patientId": "demo_patient_07",
      "plan": {
        "title": "Adaptação a mudanças na rotina",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_6_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.114Z"
          },
          {
            "id": "demo_objective_6_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.116Z"
          },
          {
            "id": "demo_objective_6_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.118Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261013_0",
          "demo_session_demo_appointment_20261020_0",
          "demo_session_demo_appointment_20261027_0",
          "demo_session_demo_appointment_20261103_0"
        ],
        "history": [
          {
            "id": "demo_auto_200",
            "date": "2026-11-04T21:56:43.114Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_07",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_201",
            "date": "2026-11-04T21:56:43.116Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_07",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_6_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.114Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_202",
            "date": "2026-11-04T21:56:43.118Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_07",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_6_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.114Z"
                  },
                  {
                    "id": "demo_objective_6_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.116Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_203",
            "date": "2026-11-04T21:56:43.121Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_07",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_6_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.114Z"
                  },
                  {
                    "id": "demo_objective_6_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.116Z"
                  },
                  {
                    "id": "demo_objective_6_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.118Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.113Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "focada_emocoes",
      "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.121Z"
    },
    {
      "id": "demo_treatment_7",
      "patientId": "demo_patient_08",
      "plan": {
        "title": "Organização de demandas do trabalho",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_7_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.127Z"
          },
          {
            "id": "demo_objective_7_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.129Z"
          },
          {
            "id": "demo_objective_7_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.131Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261006_1",
          "demo_session_demo_appointment_20261020_1",
          "demo_session_demo_appointment_20261027_1",
          "demo_session_demo_appointment_20261103_1"
        ],
        "history": [
          {
            "id": "demo_auto_204",
            "date": "2026-11-04T21:56:43.127Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_08",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_205",
            "date": "2026-11-04T21:56:43.129Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_08",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_7_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.127Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_206",
            "date": "2026-11-04T21:56:43.131Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_08",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_7_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.127Z"
                  },
                  {
                    "id": "demo_objective_7_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.129Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_207",
            "date": "2026-11-04T21:56:43.133Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_08",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_7_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.127Z"
                  },
                  {
                    "id": "demo_objective_7_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.129Z"
                  },
                  {
                    "id": "demo_objective_7_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.131Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.124Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "aceitacao_compromisso",
      "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.133Z"
    },
    {
      "id": "demo_treatment_8",
      "patientId": "demo_patient_09",
      "plan": {
        "title": "Comunicação e relações familiares",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-03",
        "endDate": "",
        "summary": "Referencial registrado: DBT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_8_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.136Z"
          },
          {
            "id": "demo_objective_8_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.139Z"
          },
          {
            "id": "demo_objective_8_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.143Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261006_2",
          "demo_session_demo_appointment_20261013_2",
          "demo_session_demo_appointment_20261027_2",
          "demo_session_demo_appointment_20261103_2"
        ],
        "history": [
          {
            "id": "demo_auto_208",
            "date": "2026-11-04T21:56:43.136Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_09",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "dialetica",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: DBT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_209",
            "date": "2026-11-04T21:56:43.139Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_09",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "dialetica",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: DBT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_8_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.136Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_210",
            "date": "2026-11-04T21:56:43.143Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_09",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "dialetica",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: DBT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_8_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.136Z"
                  },
                  {
                    "id": "demo_objective_8_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.139Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_211",
            "date": "2026-11-04T21:56:43.147Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_09",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "dialetica",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: DBT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_8_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.136Z"
                  },
                  {
                    "id": "demo_objective_8_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.139Z"
                  },
                  {
                    "id": "demo_objective_8_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.143Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.135Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "dialetica",
      "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.147Z"
    },
    {
      "id": "demo_treatment_9",
      "patientId": "demo_patient_10",
      "plan": {
        "title": "Rotina de sono e autocuidado",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Psicodinâmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_9_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.153Z"
          },
          {
            "id": "demo_objective_9_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.156Z"
          },
          {
            "id": "demo_objective_9_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.159Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261013_3",
          "demo_session_demo_appointment_20261020_3",
          "demo_session_demo_appointment_20261027_3",
          "demo_session_demo_appointment_20261103_3"
        ],
        "history": [
          {
            "id": "demo_auto_212",
            "date": "2026-11-04T21:56:43.153Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_10",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicodinamica",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicodinâmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_213",
            "date": "2026-11-04T21:56:43.156Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_10",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicodinamica",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicodinâmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_9_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.153Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_214",
            "date": "2026-11-04T21:56:43.159Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_10",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicodinamica",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicodinâmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_9_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.153Z"
                  },
                  {
                    "id": "demo_objective_9_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.156Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_215",
            "date": "2026-11-04T21:56:43.163Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_10",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicodinamica",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicodinâmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_9_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.153Z"
                  },
                  {
                    "id": "demo_objective_9_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.156Z"
                  },
                  {
                    "id": "demo_objective_9_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.159Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.150Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "psicodinamica",
      "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.163Z"
    },
    {
      "id": "demo_treatment_10",
      "patientId": "demo_patient_11",
      "plan": {
        "title": "Transição acadêmica e profissional",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Integrativa. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_10_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.168Z"
          },
          {
            "id": "demo_objective_10_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.170Z"
          },
          {
            "id": "demo_objective_10_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.173Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261013_4",
          "demo_session_demo_appointment_20261020_4",
          "demo_session_demo_appointment_20261027_4",
          "demo_session_demo_appointment_20261103_4"
        ],
        "history": [
          {
            "id": "demo_auto_216",
            "date": "2026-11-04T21:56:43.168Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_11",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "integrative",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Integrativa. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_217",
            "date": "2026-11-04T21:56:43.171Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_11",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "integrative",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Integrativa. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_10_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.168Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_218",
            "date": "2026-11-04T21:56:43.173Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_11",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "integrative",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Integrativa. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_10_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.168Z"
                  },
                  {
                    "id": "demo_objective_10_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.170Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_219",
            "date": "2026-11-04T21:56:43.175Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_11",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "integrative",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Integrativa. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_10_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.168Z"
                  },
                  {
                    "id": "demo_objective_10_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.170Z"
                  },
                  {
                    "id": "demo_objective_10_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.173Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.165Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "integrative",
      "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "quinzenal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.175Z"
    },
    {
      "id": "demo_treatment_11",
      "patientId": "demo_patient_12",
      "plan": {
        "title": "Reconhecimento de emoções",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_11_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.180Z"
          },
          {
            "id": "demo_objective_11_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.182Z"
          },
          {
            "id": "demo_objective_11_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.184Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261013_5",
          "demo_session_demo_appointment_20261020_5",
          "demo_session_demo_appointment_20261027_5",
          "demo_session_demo_appointment_20261103_5"
        ],
        "history": [
          {
            "id": "demo_auto_220",
            "date": "2026-11-04T21:56:43.180Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_12",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_221",
            "date": "2026-11-04T21:56:43.182Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_12",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_11_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.180Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_222",
            "date": "2026-11-04T21:56:43.184Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_12",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_11_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.180Z"
                  },
                  {
                    "id": "demo_objective_11_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.182Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_223",
            "date": "2026-11-04T21:56:43.187Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_12",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_11_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.180Z"
                  },
                  {
                    "id": "demo_objective_11_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.182Z"
                  },
                  {
                    "id": "demo_objective_11_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.184Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.177Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "fenomenologica",
      "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.187Z"
    },
    {
      "id": "demo_treatment_12",
      "patientId": "demo_patient_13",
      "plan": {
        "title": "Adaptação a mudanças na rotina",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-03",
        "endDate": "",
        "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_12_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.191Z"
          },
          {
            "id": "demo_objective_12_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.193Z"
          },
          {
            "id": "demo_objective_12_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.195Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261014_0",
          "demo_session_demo_appointment_20261021_0",
          "demo_session_demo_appointment_20261028_0",
          "demo_session_demo_appointment_20261104_0"
        ],
        "history": [
          {
            "id": "demo_auto_224",
            "date": "2026-11-04T21:56:43.191Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_13",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_225",
            "date": "2026-11-04T21:56:43.193Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_13",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_12_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.191Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_226",
            "date": "2026-11-04T21:56:43.195Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_13",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_12_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.191Z"
                  },
                  {
                    "id": "demo_objective_12_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.193Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_227",
            "date": "2026-11-04T21:56:43.197Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_13",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_12_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.191Z"
                  },
                  {
                    "id": "demo_objective_12_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.193Z"
                  },
                  {
                    "id": "demo_objective_12_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.195Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.189Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "tcc",
      "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.197Z"
    },
    {
      "id": "demo_treatment_13",
      "patientId": "demo_patient_14",
      "plan": {
        "title": "Organização de demandas do trabalho",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Psicanálise. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_13_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.201Z"
          },
          {
            "id": "demo_objective_13_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.206Z"
          },
          {
            "id": "demo_objective_13_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.210Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261007_1",
          "demo_session_demo_appointment_20261014_1",
          "demo_session_demo_appointment_20261021_1",
          "demo_session_demo_appointment_20261028_1"
        ],
        "history": [
          {
            "id": "demo_auto_228",
            "date": "2026-11-04T21:56:43.201Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_14",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicanalise",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicanálise. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_229",
            "date": "2026-11-04T21:56:43.206Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_14",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicanalise",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicanálise. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_13_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.201Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_230",
            "date": "2026-11-04T21:56:43.210Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_14",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicanalise",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicanálise. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_13_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.201Z"
                  },
                  {
                    "id": "demo_objective_13_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.206Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_231",
            "date": "2026-11-04T21:56:43.213Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_14",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicanalise",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Psicanálise. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_13_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.201Z"
                  },
                  {
                    "id": "demo_objective_13_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.206Z"
                  },
                  {
                    "id": "demo_objective_13_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.210Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.198Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "psicanalise",
      "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.213Z"
    },
    {
      "id": "demo_treatment_14",
      "patientId": "demo_patient_15",
      "plan": {
        "title": "Comunicação e relações familiares",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Humanista. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_14_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.216Z"
          },
          {
            "id": "demo_objective_14_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.218Z"
          },
          {
            "id": "demo_objective_14_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.221Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261007_2",
          "demo_session_demo_appointment_20261014_2",
          "demo_session_demo_appointment_20261021_2",
          "demo_session_demo_appointment_20261028_2"
        ],
        "history": [
          {
            "id": "demo_auto_232",
            "date": "2026-11-04T21:56:43.216Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_15",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "humanista",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Humanista. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_233",
            "date": "2026-11-04T21:56:43.218Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_15",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "humanista",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Humanista. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_14_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.216Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_234",
            "date": "2026-11-04T21:56:43.221Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_15",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "humanista",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Humanista. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_14_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.216Z"
                  },
                  {
                    "id": "demo_objective_14_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.218Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_235",
            "date": "2026-11-04T21:56:43.223Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_15",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "humanista",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Humanista. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_14_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.216Z"
                  },
                  {
                    "id": "demo_objective_14_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.218Z"
                  },
                  {
                    "id": "demo_objective_14_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.221Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.214Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "humanista",
      "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.223Z"
    },
    {
      "id": "demo_treatment_15",
      "patientId": "demo_patient_16",
      "plan": {
        "title": "Rotina de sono e autocuidado",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_15_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.230Z"
          },
          {
            "id": "demo_objective_15_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.233Z"
          },
          {
            "id": "demo_objective_15_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.235Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260930_3",
          "demo_session_demo_appointment_20261007_3",
          "demo_session_demo_appointment_20261014_3",
          "demo_session_demo_appointment_20261028_3"
        ],
        "history": [
          {
            "id": "demo_auto_236",
            "date": "2026-11-04T21:56:43.230Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_16",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_237",
            "date": "2026-11-04T21:56:43.233Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_16",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_15_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.230Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_238",
            "date": "2026-11-04T21:56:43.235Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_16",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_15_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.230Z"
                  },
                  {
                    "id": "demo_objective_15_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.233Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_239",
            "date": "2026-11-04T21:56:43.237Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_16",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_15_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.230Z"
                  },
                  {
                    "id": "demo_objective_15_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.233Z"
                  },
                  {
                    "id": "demo_objective_15_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.235Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.226Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "gestalt",
      "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "quinzenal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.237Z"
    },
    {
      "id": "demo_treatment_16",
      "patientId": "demo_patient_17",
      "plan": {
        "title": "Transição acadêmica e profissional",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-03",
        "endDate": "",
        "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_16_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.240Z"
          },
          {
            "id": "demo_objective_16_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.242Z"
          },
          {
            "id": "demo_objective_16_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.243Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260930_4",
          "demo_session_demo_appointment_20261007_4",
          "demo_session_demo_appointment_20261014_4",
          "demo_session_demo_appointment_20261021_4"
        ],
        "history": [
          {
            "id": "demo_auto_240",
            "date": "2026-11-04T21:56:43.240Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_17",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_241",
            "date": "2026-11-04T21:56:43.242Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_17",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_16_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.240Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_242",
            "date": "2026-11-04T21:56:43.243Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_17",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_16_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.240Z"
                  },
                  {
                    "id": "demo_objective_16_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.242Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_243",
            "date": "2026-11-04T21:56:43.245Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_17",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_16_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.240Z"
                  },
                  {
                    "id": "demo_objective_16_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.242Z"
                  },
                  {
                    "id": "demo_objective_16_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.243Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.238Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "sistêmica",
      "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.245Z"
    },
    {
      "id": "demo_treatment_17",
      "patientId": "demo_patient_18",
      "plan": {
        "title": "Reconhecimento de emoções",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_17_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.248Z"
          },
          {
            "id": "demo_objective_17_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.250Z"
          },
          {
            "id": "demo_objective_17_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.252Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261007_5",
          "demo_session_demo_appointment_20261014_5",
          "demo_session_demo_appointment_20261021_5",
          "demo_session_demo_appointment_20261028_5"
        ],
        "history": [
          {
            "id": "demo_auto_244",
            "date": "2026-11-04T21:56:43.248Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_18",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_245",
            "date": "2026-11-04T21:56:43.251Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_18",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_17_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.248Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_246",
            "date": "2026-11-04T21:56:43.253Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_18",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_17_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.248Z"
                  },
                  {
                    "id": "demo_objective_17_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.250Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_247",
            "date": "2026-11-04T21:56:43.254Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_18",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_17_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.248Z"
                  },
                  {
                    "id": "demo_objective_17_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.250Z"
                  },
                  {
                    "id": "demo_objective_17_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.252Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.247Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "focada_emocoes",
      "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.254Z"
    },
    {
      "id": "demo_treatment_18",
      "patientId": "demo_patient_19",
      "plan": {
        "title": "Adaptação a mudanças na rotina",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_18_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.258Z"
          },
          {
            "id": "demo_objective_18_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.260Z"
          },
          {
            "id": "demo_objective_18_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.263Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261008_0",
          "demo_session_demo_appointment_20261015_0",
          "demo_session_demo_appointment_20261022_0",
          "demo_session_demo_appointment_20261029_0"
        ],
        "history": [
          {
            "id": "demo_auto_248",
            "date": "2026-11-04T21:56:43.258Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_19",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_249",
            "date": "2026-11-04T21:56:43.260Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_19",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_18_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.258Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_250",
            "date": "2026-11-04T21:56:43.263Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_19",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_18_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.258Z"
                  },
                  {
                    "id": "demo_objective_18_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.260Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_251",
            "date": "2026-11-04T21:56:43.266Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_19",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Adaptação a mudanças na rotina",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_18_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.258Z"
                  },
                  {
                    "id": "demo_objective_18_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.260Z"
                  },
                  {
                    "id": "demo_objective_18_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.263Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.256Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "aceitacao_compromisso",
      "goals": "Acompanhar adaptação a mudanças na rotina. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.266Z"
    },
    {
      "id": "demo_treatment_19",
      "patientId": "demo_patient_20",
      "plan": {
        "title": "Organização de demandas do trabalho",
        "startDate": "2026-08-31",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: DBT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_19_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "achieved",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.270Z"
          },
          {
            "id": "demo_objective_19_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.272Z"
          },
          {
            "id": "demo_objective_19_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.274Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261001_1",
          "demo_session_demo_appointment_20261015_1",
          "demo_session_demo_appointment_20261022_1",
          "demo_session_demo_appointment_20261029_1"
        ],
        "history": [
          {
            "id": "demo_auto_252",
            "date": "2026-11-04T21:56:43.270Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_20",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "dialetica",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: DBT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_253",
            "date": "2026-11-04T21:56:43.272Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_20",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "dialetica",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: DBT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_19_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.270Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_254",
            "date": "2026-11-04T21:56:43.274Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_20",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "dialetica",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: DBT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_19_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.270Z"
                  },
                  {
                    "id": "demo_objective_19_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.272Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_255",
            "date": "2026-11-04T21:56:43.276Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_20",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "dialetica",
              "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Organização de demandas do trabalho",
                "startDate": "2026-08-31",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: DBT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_19_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "achieved",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.270Z"
                  },
                  {
                    "id": "demo_objective_19_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.272Z"
                  },
                  {
                    "id": "demo_objective_19_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.274Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.269Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "dialetica",
      "goals": "Acompanhar organização de demandas do trabalho. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.276Z"
    },
    {
      "id": "demo_treatment_20",
      "patientId": "demo_patient_21",
      "plan": {
        "title": "Comunicação e relações familiares",
        "startDate": "2026-10-18",
        "reviewDate": "2026-11-03",
        "endDate": "",
        "summary": "Referencial registrado: Psicodinâmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_20_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.283Z"
          },
          {
            "id": "demo_objective_20_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.287Z"
          },
          {
            "id": "demo_objective_20_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.289Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261022_2",
          "demo_session_demo_appointment_20261029_2"
        ],
        "history": [
          {
            "id": "demo_auto_256",
            "date": "2026-11-04T21:56:43.283Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_21",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicodinamica",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Psicodinâmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_257",
            "date": "2026-11-04T21:56:43.287Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_21",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicodinamica",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Psicodinâmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_20_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.283Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_258",
            "date": "2026-11-04T21:56:43.289Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_21",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicodinamica",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Psicodinâmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_20_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.283Z"
                  },
                  {
                    "id": "demo_objective_20_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.287Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_259",
            "date": "2026-11-04T21:56:43.290Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_21",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "psicodinamica",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "quinzenal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-03",
                "endDate": "",
                "summary": "Referencial registrado: Psicodinâmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_20_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.283Z"
                  },
                  {
                    "id": "demo_objective_20_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.287Z"
                  },
                  {
                    "id": "demo_objective_20_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.289Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.281Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "psicodinamica",
      "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "quinzenal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.290Z"
    },
    {
      "id": "demo_treatment_21",
      "patientId": "demo_patient_22",
      "plan": {
        "title": "Rotina de sono e autocuidado",
        "startDate": "2026-10-18",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Integrativa. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_21_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.294Z"
          },
          {
            "id": "demo_objective_21_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.296Z"
          },
          {
            "id": "demo_objective_21_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.298Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261022_3",
          "demo_session_demo_appointment_20261029_3"
        ],
        "history": [
          {
            "id": "demo_auto_260",
            "date": "2026-11-04T21:56:43.294Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_22",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "integrative",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Integrativa. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_261",
            "date": "2026-11-04T21:56:43.296Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_22",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "integrative",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Integrativa. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_21_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.294Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_262",
            "date": "2026-11-04T21:56:43.298Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_22",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "integrative",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Integrativa. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_21_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.294Z"
                  },
                  {
                    "id": "demo_objective_21_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.296Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_263",
            "date": "2026-11-04T21:56:43.301Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_22",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "integrative",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Integrativa. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_21_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.294Z"
                  },
                  {
                    "id": "demo_objective_21_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.296Z"
                  },
                  {
                    "id": "demo_objective_21_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.298Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.292Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "integrative",
      "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.301Z"
    },
    {
      "id": "demo_treatment_22",
      "patientId": "demo_patient_23",
      "plan": {
        "title": "Transição acadêmica e profissional",
        "startDate": "2026-10-18",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_22_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.305Z"
          },
          {
            "id": "demo_objective_22_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.307Z"
          },
          {
            "id": "demo_objective_22_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.310Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261022_4",
          "demo_session_demo_appointment_20261029_4"
        ],
        "history": [
          {
            "id": "demo_auto_264",
            "date": "2026-11-04T21:56:43.305Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_23",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_265",
            "date": "2026-11-04T21:56:43.307Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_23",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_22_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.305Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_266",
            "date": "2026-11-04T21:56:43.310Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_23",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_22_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.305Z"
                  },
                  {
                    "id": "demo_objective_22_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.307Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_267",
            "date": "2026-11-04T21:56:43.312Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_23",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "fenomenologica",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: Fenomenológica (Fenomenologia). Acompanhamento da experiência vivida e dos sentidos atribuídos às mudanças na rotina. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_22_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.305Z"
                  },
                  {
                    "id": "demo_objective_22_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.307Z"
                  },
                  {
                    "id": "demo_objective_22_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.310Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.303Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "fenomenologica",
      "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.312Z"
    },
    {
      "id": "demo_treatment_23",
      "patientId": "demo_patient_24",
      "plan": {
        "title": "Reconhecimento de emoções",
        "startDate": "2026-10-18",
        "reviewDate": "2026-11-18",
        "endDate": "",
        "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_23_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.319Z"
          },
          {
            "id": "demo_objective_23_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.323Z"
          },
          {
            "id": "demo_objective_23_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.326Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20261022_5"
        ],
        "history": [
          {
            "id": "demo_auto_268",
            "date": "2026-11-04T21:56:43.319Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_24",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_269",
            "date": "2026-11-04T21:56:43.323Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_24",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_23_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.319Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_270",
            "date": "2026-11-04T21:56:43.326Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_24",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_23_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.319Z"
                  },
                  {
                    "id": "demo_objective_23_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.323Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_271",
            "date": "2026-11-04T21:56:43.328Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_24",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "tcc",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "active",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-10-18",
                "reviewDate": "2026-11-18",
                "endDate": "",
                "summary": "Referencial registrado: TCC. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_23_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.319Z"
                  },
                  {
                    "id": "demo_objective_23_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.323Z"
                  },
                  {
                    "id": "demo_objective_23_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.326Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.314Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "tcc",
      "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "active",
      "updatedAt": "2026-11-04T21:56:43.328Z"
    },
    {
      "id": "demo_treatment_26",
      "patientId": "demo_patient_27",
      "plan": {
        "title": "Comunicação e relações familiares",
        "startDate": "2026-08-26",
        "reviewDate": "",
        "endDate": "",
        "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_26_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.332Z"
          },
          {
            "id": "demo_objective_26_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.334Z"
          },
          {
            "id": "demo_objective_26_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.336Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260918_2",
          "demo_session_demo_appointment_20260925_2",
          "demo_session_demo_appointment_20261002_2",
          "demo_session_demo_appointment_20261009_2"
        ],
        "history": [
          {
            "id": "demo_auto_272",
            "date": "2026-11-04T21:56:43.332Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_27",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "paused",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_273",
            "date": "2026-11-04T21:56:43.334Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_27",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "paused",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_26_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.332Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_274",
            "date": "2026-11-04T21:56:43.336Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_27",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "paused",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_26_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.332Z"
                  },
                  {
                    "id": "demo_objective_26_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.334Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_275",
            "date": "2026-11-04T21:56:43.338Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_27",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "gestalt",
              "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "paused",
              "plan": {
                "title": "Comunicação e relações familiares",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "",
                "summary": "Referencial registrado: Gestalt-terapia. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_26_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.332Z"
                  },
                  {
                    "id": "demo_objective_26_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.334Z"
                  },
                  {
                    "id": "demo_objective_26_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.336Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.330Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "gestalt",
      "goals": "Acompanhar comunicação e relações familiares. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "paused",
      "updatedAt": "2026-11-04T21:56:43.338Z"
    },
    {
      "id": "demo_treatment_27",
      "patientId": "demo_patient_28",
      "plan": {
        "title": "Rotina de sono e autocuidado",
        "startDate": "2026-08-26",
        "reviewDate": "",
        "endDate": "2026-10-14",
        "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_27_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.342Z"
          },
          {
            "id": "demo_objective_27_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.344Z"
          },
          {
            "id": "demo_objective_27_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.346Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260918_3",
          "demo_session_demo_appointment_20260925_3",
          "demo_session_demo_appointment_20261002_3",
          "demo_session_demo_appointment_20261009_3"
        ],
        "history": [
          {
            "id": "demo_auto_276",
            "date": "2026-11-04T21:56:43.342Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_28",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_277",
            "date": "2026-11-04T21:56:43.344Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_28",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_27_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.342Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_278",
            "date": "2026-11-04T21:56:43.347Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_28",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_27_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.342Z"
                  },
                  {
                    "id": "demo_objective_27_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.344Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_279",
            "date": "2026-11-04T21:56:43.349Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_28",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "sistêmica",
              "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Rotina de sono e autocuidado",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: Sistêmica. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_27_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.342Z"
                  },
                  {
                    "id": "demo_objective_27_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.344Z"
                  },
                  {
                    "id": "demo_objective_27_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.346Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.340Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "sistêmica",
      "goals": "Acompanhar rotina de sono e autocuidado. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "completed",
      "updatedAt": "2026-11-04T21:56:43.349Z"
    },
    {
      "id": "demo_treatment_28",
      "patientId": "demo_patient_29",
      "plan": {
        "title": "Transição acadêmica e profissional",
        "startDate": "2026-08-26",
        "reviewDate": "",
        "endDate": "2026-10-14",
        "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_28_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.353Z"
          },
          {
            "id": "demo_objective_28_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.355Z"
          },
          {
            "id": "demo_objective_28_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.357Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260918_4",
          "demo_session_demo_appointment_20260925_4",
          "demo_session_demo_appointment_20261002_4",
          "demo_session_demo_appointment_20261009_4"
        ],
        "history": [
          {
            "id": "demo_auto_280",
            "date": "2026-11-04T21:56:43.353Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_29",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_281",
            "date": "2026-11-04T21:56:43.355Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_29",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_28_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.353Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_282",
            "date": "2026-11-04T21:56:43.357Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_29",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_28_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.353Z"
                  },
                  {
                    "id": "demo_objective_28_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.355Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_283",
            "date": "2026-11-04T21:56:43.359Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_29",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "focada_emocoes",
              "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Transição acadêmica e profissional",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: Focada nas emoções. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_28_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.353Z"
                  },
                  {
                    "id": "demo_objective_28_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.355Z"
                  },
                  {
                    "id": "demo_objective_28_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.357Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.351Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "focada_emocoes",
      "goals": "Acompanhar transição acadêmica e profissional. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "completed",
      "updatedAt": "2026-11-04T21:56:43.359Z"
    },
    {
      "id": "demo_treatment_29",
      "patientId": "demo_patient_30",
      "plan": {
        "title": "Reconhecimento de emoções",
        "startDate": "2026-08-26",
        "reviewDate": "",
        "endDate": "2026-10-14",
        "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
        "objectives": [
          {
            "id": "demo_objective_29_0",
            "title": "Identificar situações relevantes da rotina",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.368Z"
          },
          {
            "id": "demo_objective_29_1",
            "title": "Acompanhar os objetivos combinados",
            "status": "working",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.375Z"
          },
          {
            "id": "demo_objective_29_2",
            "title": "Revisar avanços e planejar continuidade",
            "status": "pending",
            "note": "",
            "createdAt": "2026-11-04T21:56:43.379Z"
          }
        ],
        "sessionIds": [
          "demo_session_demo_appointment_20260911_5",
          "demo_session_demo_appointment_20260918_5",
          "demo_session_demo_appointment_20261002_5",
          "demo_session_demo_appointment_20261009_5"
        ],
        "history": [
          {
            "id": "demo_auto_284",
            "date": "2026-11-04T21:56:43.368Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_30",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_285",
            "date": "2026-11-04T21:56:43.375Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_30",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_29_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.368Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_286",
            "date": "2026-11-04T21:56:43.379Z",
            "action": "Objetivo atualizado",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_30",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_29_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.368Z"
                  },
                  {
                    "id": "demo_objective_29_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.375Z"
                  }
                ],
                "sessionIds": []
              }
            }
          },
          {
            "id": "demo_auto_287",
            "date": "2026-11-04T21:56:43.383Z",
            "action": "Vínculos de sessões revisados",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_30",
              "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
              "approach": "aceitacao_compromisso",
              "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
              "frequency": "semanal",
              "sessionsGoal": 12,
              "status": "completed",
              "plan": {
                "title": "Reconhecimento de emoções",
                "startDate": "2026-08-26",
                "reviewDate": "",
                "endDate": "2026-10-14",
                "summary": "Referencial registrado: ACT. Acompanhamento da demanda, do contexto atual e dos objetivos definidos em conjunto. O plano é revisto a partir dos temas trazidos nos encontros.",
                "objectives": [
                  {
                    "id": "demo_objective_29_0",
                    "title": "Identificar situações relevantes da rotina",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.368Z"
                  },
                  {
                    "id": "demo_objective_29_1",
                    "title": "Acompanhar os objetivos combinados",
                    "status": "working",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.375Z"
                  },
                  {
                    "id": "demo_objective_29_2",
                    "title": "Revisar avanços e planejar continuidade",
                    "status": "pending",
                    "note": "",
                    "createdAt": "2026-11-04T21:56:43.379Z"
                  }
                ],
                "sessionIds": []
              }
            }
          }
        ]
      },
      "createdAt": "2026-11-04T21:56:43.361Z",
      "diagnosis": "Demanda em acompanhamento; sem hipótese diagnóstica registrada",
      "approach": "aceitacao_compromisso",
      "goals": "Acompanhar reconhecimento de emoções. Objetivo definido em conjunto para o acompanhamento.",
      "frequency": "semanal",
      "sessionsGoal": 12,
      "status": "completed",
      "updatedAt": "2026-11-04T21:56:43.383Z"
    }
  ],
  "sessionDrafts": [
    {
      "id": "demo_session_draft",
      "patientId": "demo_patient_16",
      "appointmentId": "demo_appointment_20261104_3",
      "date": "2026-11-04",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "content": "Retomou a organização da rotina e trouxe uma situação do trabalho. Registro em elaboração; complementar antes de concluir o atendimento.",
      "evolution": {
        "modality": "in_person",
        "duration": 50,
        "focus": "",
        "objectives": "",
        "homework": "",
        "treatmentId": "demo_treatment_15",
        "objectiveIds": [
          "demo_objective_15_1"
        ]
      },
      "billing": {
        "mode": "single",
        "amount": 140,
        "paid": false,
        "packageId": null
      },
      "interventions": "",
      "nextPlan": "",
      "mood": "",
      "adherence": "",
      "revisionReason": "",
      "createdAt": "2026-11-04T21:56:43.565Z",
      "updatedAt": "2026-11-04T21:56:43.565Z"
    }
  ],
  "assessments": [
    {
      "id": "demo_assessment_0_0",
      "patientId": "demo_patient_01",
      "date": "2026-10-11",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.387Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 0,
        "4": 1,
        "5": 2,
        "6": 0
      },
      "score": 6
    },
    {
      "id": "demo_assessment_0_1",
      "patientId": "demo_patient_01",
      "date": "2026-11-02",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.394Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 0,
        "2": 1,
        "3": 0,
        "4": 0,
        "5": 1,
        "6": 0
      },
      "score": 2
    },
    {
      "id": "demo_assessment_1_0",
      "patientId": "demo_patient_02",
      "date": "2026-10-11",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.398Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 1,
        "1": 2,
        "2": 0,
        "3": 1,
        "4": 2,
        "5": 0,
        "6": 1,
        "7": 2,
        "8": 0
      },
      "score": 9
    },
    {
      "id": "demo_assessment_1_1",
      "patientId": "demo_patient_02",
      "date": "2026-11-02",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.401Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 1,
        "2": 0,
        "3": 0,
        "4": 1,
        "5": 0,
        "6": 0,
        "7": 1,
        "8": 0
      },
      "score": 3
    },
    {
      "id": "demo_assessment_2_0",
      "patientId": "demo_patient_03",
      "date": "2026-10-11",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.408Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 2,
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 0,
        "5": 1,
        "6": 2
      },
      "score": 8
    },
    {
      "id": "demo_assessment_2_1",
      "patientId": "demo_patient_03",
      "date": "2026-11-02",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.415Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 1,
        "1": 0,
        "2": 0,
        "3": 1,
        "4": 0,
        "5": 0,
        "6": 1
      },
      "score": 3
    },
    {
      "id": "demo_assessment_3_0",
      "patientId": "demo_patient_04",
      "date": "2026-10-11",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.419Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 0,
        "4": 1,
        "5": 2,
        "6": 0,
        "7": 1,
        "8": 0
      },
      "score": 7
    },
    {
      "id": "demo_assessment_3_1",
      "patientId": "demo_patient_04",
      "date": "2026-11-02",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.424Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 0,
        "2": 1,
        "3": 0,
        "4": 0,
        "5": 1,
        "6": 0,
        "7": 0,
        "8": 0
      },
      "score": 2
    },
    {
      "id": "demo_assessment_4_0",
      "patientId": "demo_patient_05",
      "date": "2026-10-11",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.430Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 1,
        "1": 2,
        "2": 0,
        "3": 1,
        "4": 2,
        "5": 0,
        "6": 1
      },
      "score": 7
    },
    {
      "id": "demo_assessment_4_1",
      "patientId": "demo_patient_05",
      "date": "2026-11-02",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.433Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 1,
        "2": 0,
        "3": 0,
        "4": 1,
        "5": 0,
        "6": 0
      },
      "score": 2
    },
    {
      "id": "demo_assessment_5_0",
      "patientId": "demo_patient_06",
      "date": "2026-10-11",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.436Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 2,
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 0,
        "5": 1,
        "6": 2,
        "7": 0,
        "8": 0
      },
      "score": 8
    },
    {
      "id": "demo_assessment_5_1",
      "patientId": "demo_patient_06",
      "date": "2026-11-02",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.440Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 1,
        "1": 0,
        "2": 0,
        "3": 1,
        "4": 0,
        "5": 0,
        "6": 1,
        "7": 0,
        "8": 0
      },
      "score": 3
    },
    {
      "id": "demo_assessment_6_0",
      "patientId": "demo_patient_07",
      "date": "2026-10-11",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.445Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 0,
        "4": 1,
        "5": 2,
        "6": 0
      },
      "score": 6
    },
    {
      "id": "demo_assessment_6_1",
      "patientId": "demo_patient_07",
      "date": "2026-11-02",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.448Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 0,
        "2": 1,
        "3": 0,
        "4": 0,
        "5": 1,
        "6": 0
      },
      "score": 2
    },
    {
      "id": "demo_assessment_7_0",
      "patientId": "demo_patient_08",
      "date": "2026-10-11",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.452Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 1,
        "1": 2,
        "2": 0,
        "3": 1,
        "4": 2,
        "5": 0,
        "6": 1,
        "7": 2,
        "8": 0
      },
      "score": 9
    },
    {
      "id": "demo_assessment_7_1",
      "patientId": "demo_patient_08",
      "date": "2026-11-02",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.457Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 1,
        "2": 0,
        "3": 0,
        "4": 1,
        "5": 0,
        "6": 0,
        "7": 1,
        "8": 0
      },
      "score": 3
    },
    {
      "id": "demo_assessment_8_0",
      "patientId": "demo_patient_09",
      "date": "2026-10-11",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.465Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 2,
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 0,
        "5": 1,
        "6": 2
      },
      "score": 8
    },
    {
      "id": "demo_assessment_8_1",
      "patientId": "demo_patient_09",
      "date": "2026-11-02",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.470Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 1,
        "1": 0,
        "2": 0,
        "3": 1,
        "4": 0,
        "5": 0,
        "6": 1
      },
      "score": 3
    },
    {
      "id": "demo_assessment_9_0",
      "patientId": "demo_patient_10",
      "date": "2026-10-11",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.479Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 0,
        "4": 1,
        "5": 2,
        "6": 0,
        "7": 1,
        "8": 0
      },
      "score": 7
    },
    {
      "id": "demo_assessment_9_1",
      "patientId": "demo_patient_10",
      "date": "2026-11-02",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.484Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 0,
        "2": 1,
        "3": 0,
        "4": 0,
        "5": 1,
        "6": 0,
        "7": 0,
        "8": 0
      },
      "score": 2
    },
    {
      "id": "demo_assessment_10_0",
      "patientId": "demo_patient_11",
      "date": "2026-10-11",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.488Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 1,
        "1": 2,
        "2": 0,
        "3": 1,
        "4": 2,
        "5": 0,
        "6": 1
      },
      "score": 7
    },
    {
      "id": "demo_assessment_10_1",
      "patientId": "demo_patient_11",
      "date": "2026-11-02",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.492Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 0,
        "1": 1,
        "2": 0,
        "3": 0,
        "4": 1,
        "5": 0,
        "6": 0
      },
      "score": 2
    },
    {
      "id": "demo_assessment_11_0",
      "patientId": "demo_patient_12",
      "date": "2026-10-11",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.495Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 2,
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 0,
        "5": 1,
        "6": 2,
        "7": 0,
        "8": 0
      },
      "score": 8
    },
    {
      "id": "demo_assessment_11_1",
      "patientId": "demo_patient_12",
      "date": "2026-11-02",
      "scale": "phq9",
      "createdAt": "2026-11-04T21:56:43.497Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "questionnaire",
        "instrumentVersion": "phq9-br-2014-v1",
        "instrumentName": "",
        "context": "Acompanhamento das queixas apresentadas no início do processo.",
        "conclusion": "Resultados registrados para comparação longitudinal e discussão no contexto do acompanhamento.",
        "impact": "some",
        "reviewDate": "2026-11-18",
        "revisions": []
      },
      "notes": "Aplicação revisada com o paciente durante o encontro.",
      "answers": {
        "0": 1,
        "1": 0,
        "2": 0,
        "3": 1,
        "4": 0,
        "5": 0,
        "6": 1,
        "7": 0,
        "8": 0
      },
      "score": 3
    },
    {
      "id": "demo_assessment_draft",
      "patientId": "demo_patient_21",
      "date": "2026-11-04",
      "scale": "gad7",
      "createdAt": "2026-11-04T21:56:43.500Z",
      "evaluation": {
        "status": "draft",
        "mode": "questionnaire",
        "instrumentVersion": "gad7-br-2025-v1",
        "instrumentName": "",
        "context": "Respostas parciais; retomar a aplicação no próximo encontro.",
        "conclusion": "",
        "impact": "",
        "reviewDate": "",
        "revisions": []
      },
      "notes": "Aplicação em andamento.",
      "answers": {
        "0": 1,
        "1": 0
      },
      "score": null
    },
    {
      "id": "demo_assessment_manual",
      "patientId": "demo_patient_22",
      "date": "2026-11-01",
      "scale": "manual",
      "createdAt": "2026-11-04T21:56:43.502Z",
      "evaluation": {
        "status": "confirmed",
        "mode": "manual",
        "instrumentVersion": "manual-v1",
        "instrumentName": "Entrevista inicial",
        "context": "Levantamento da demanda, do contexto atual e dos objetivos do paciente.",
        "conclusion": "Prosseguir com o levantamento da demanda nos próximos encontros.",
        "impact": "",
        "reviewDate": "",
        "revisions": []
      },
      "notes": "Registro descritivo do acolhimento e das expectativas para o acompanhamento.",
      "score": null,
      "answers": {}
    }
  ],
  "prescriptions": [
    {
      "id": "demo_guidance_0",
      "patientId": "demo_patient_01",
      "kind": "referral",
      "start": "2026-10-27",
      "createdAt": "2026-11-04T21:56:43.505Z",
      "content": "Encaminhamento para avaliação complementar da demanda apresentada, com retorno ao acompanhamento para discussão das informações relevantes.",
      "guidance": {
        "status": "confirmed",
        "title": "Encaminhamento para avaliação complementar",
        "recipient": "Renata Almeida Freire",
        "service": "Avaliação complementar",
        "contact": "",
        "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
        "professionalName": "Marina Duarte Vasconcelos",
        "professionalId": "",
        "internalNotes": "",
        "followup": "received",
        "followupDate": "2026-11-08",
        "delivery": "not_recorded",
        "deliveryDate": "",
        "events": [
          {
            "id": "demo_guidance_event_0",
            "type": "return_received",
            "date": "2026-11-02",
            "note": "Documento entregue ao paciente; retorno previsto para o próximo encontro.",
            "nextDate": "",
            "createdAt": "2026-11-04T21:56:43.509Z"
          }
        ],
        "revisions": [
          {
            "id": "demo_auto_288",
            "date": "2026-11-04T21:56:43.509Z",
            "action": "Registrar retorno recebido",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_01",
              "kind": "referral",
              "start": "2026-10-27",
              "content": "Encaminhamento para avaliação complementar da demanda apresentada, com retorno ao acompanhamento para discussão das informações relevantes.",
              "guidance": {
                "status": "confirmed",
                "title": "Encaminhamento para avaliação complementar",
                "recipient": "Renata Almeida Freire",
                "service": "Avaliação complementar",
                "contact": "",
                "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
                "professionalName": "Marina Duarte Vasconcelos",
                "professionalId": "",
                "internalNotes": "",
                "followup": "awaiting_return",
                "followupDate": "2026-11-08",
                "delivery": "not_recorded",
                "deliveryDate": ""
              }
            }
          }
        ]
      },
      "updatedAt": "2026-11-04T21:56:43.509Z"
    },
    {
      "id": "demo_guidance_1",
      "patientId": "demo_patient_02",
      "kind": "orientation",
      "start": "2026-10-28",
      "createdAt": "2026-11-04T21:56:43.511Z",
      "content": "Conforme conversado no encontro, registrar situações da rotina que gostaria de retomar e observar as dificuldades encontradas na organização dos compromissos.",
      "guidance": {
        "status": "confirmed",
        "title": "Acompanhamento de rotina",
        "recipient": "Bruno Henrique Azevedo",
        "service": "",
        "contact": "",
        "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
        "professionalName": "Marina Duarte Vasconcelos",
        "professionalId": "",
        "internalNotes": "",
        "followup": "pending",
        "followupDate": "2026-11-03",
        "delivery": "not_recorded",
        "deliveryDate": "",
        "events": [],
        "revisions": []
      }
    },
    {
      "id": "demo_guidance_2",
      "patientId": "demo_patient_03",
      "kind": "orientation",
      "start": "2026-10-29",
      "createdAt": "2026-11-04T21:56:43.514Z",
      "content": "Conforme conversado no encontro, registrar situações da rotina que gostaria de retomar e observar as dificuldades encontradas na organização dos compromissos.",
      "guidance": {
        "status": "confirmed",
        "title": "Acompanhamento de rotina",
        "recipient": "Camila Nogueira Batista",
        "service": "",
        "contact": "",
        "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
        "professionalName": "Marina Duarte Vasconcelos",
        "professionalId": "",
        "internalNotes": "",
        "followup": "awaiting_return",
        "followupDate": "2026-11-08",
        "delivery": "handover",
        "deliveryDate": "2026-11-02",
        "events": [
          {
            "id": "demo_guidance_event_2",
            "type": "handover",
            "date": "2026-11-02",
            "note": "Documento entregue ao paciente; retorno previsto para o próximo encontro.",
            "nextDate": "",
            "createdAt": "2026-11-04T21:56:43.517Z"
          }
        ],
        "revisions": [
          {
            "id": "demo_auto_289",
            "date": "2026-11-04T21:56:43.517Z",
            "action": "Registrar entrega em mãos",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_03",
              "kind": "orientation",
              "start": "2026-10-29",
              "content": "Conforme conversado no encontro, registrar situações da rotina que gostaria de retomar e observar as dificuldades encontradas na organização dos compromissos.",
              "guidance": {
                "status": "confirmed",
                "title": "Acompanhamento de rotina",
                "recipient": "Camila Nogueira Batista",
                "service": "",
                "contact": "",
                "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
                "professionalName": "Marina Duarte Vasconcelos",
                "professionalId": "",
                "internalNotes": "",
                "followup": "awaiting_return",
                "followupDate": "2026-11-08",
                "delivery": "not_recorded",
                "deliveryDate": ""
              }
            }
          }
        ]
      },
      "updatedAt": "2026-11-04T21:56:43.517Z"
    },
    {
      "id": "demo_guidance_3",
      "patientId": "demo_patient_04",
      "kind": "referral",
      "start": "2026-10-30",
      "createdAt": "2026-11-04T21:56:43.519Z",
      "content": "Encaminhamento para avaliação complementar da demanda apresentada, com retorno ao acompanhamento para discussão das informações relevantes.",
      "guidance": {
        "status": "confirmed",
        "title": "Encaminhamento para avaliação complementar",
        "recipient": "Renata Almeida Freire",
        "service": "Avaliação complementar",
        "contact": "",
        "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
        "professionalName": "Marina Duarte Vasconcelos",
        "professionalId": "",
        "internalNotes": "",
        "followup": "pending",
        "followupDate": "2026-11-03",
        "delivery": "not_recorded",
        "deliveryDate": "",
        "events": [],
        "revisions": []
      }
    },
    {
      "id": "demo_guidance_4",
      "patientId": "demo_patient_05",
      "kind": "orientation",
      "start": "2026-10-27",
      "createdAt": "2026-11-04T21:56:43.522Z",
      "content": "Conforme conversado no encontro, registrar situações da rotina que gostaria de retomar e observar as dificuldades encontradas na organização dos compromissos.",
      "guidance": {
        "status": "confirmed",
        "title": "Acompanhamento de rotina",
        "recipient": "Elisa Martins Pacheco",
        "service": "",
        "contact": "",
        "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
        "professionalName": "Marina Duarte Vasconcelos",
        "professionalId": "",
        "internalNotes": "",
        "followup": "awaiting_return",
        "followupDate": "2026-11-08",
        "delivery": "handover",
        "deliveryDate": "2026-11-02",
        "events": [
          {
            "id": "demo_guidance_event_4",
            "type": "handover",
            "date": "2026-11-02",
            "note": "Documento entregue ao paciente; retorno previsto para o próximo encontro.",
            "nextDate": "",
            "createdAt": "2026-11-04T21:56:43.525Z"
          }
        ],
        "revisions": [
          {
            "id": "demo_auto_290",
            "date": "2026-11-04T21:56:43.525Z",
            "action": "Registrar entrega em mãos",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_05",
              "kind": "orientation",
              "start": "2026-10-27",
              "content": "Conforme conversado no encontro, registrar situações da rotina que gostaria de retomar e observar as dificuldades encontradas na organização dos compromissos.",
              "guidance": {
                "status": "confirmed",
                "title": "Acompanhamento de rotina",
                "recipient": "Elisa Martins Pacheco",
                "service": "",
                "contact": "",
                "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
                "professionalName": "Marina Duarte Vasconcelos",
                "professionalId": "",
                "internalNotes": "",
                "followup": "awaiting_return",
                "followupDate": "2026-11-08",
                "delivery": "not_recorded",
                "deliveryDate": ""
              }
            }
          }
        ]
      },
      "updatedAt": "2026-11-04T21:56:43.525Z"
    },
    {
      "id": "demo_guidance_5",
      "patientId": "demo_patient_06",
      "kind": "orientation",
      "start": "2026-10-28",
      "createdAt": "2026-11-04T21:56:43.528Z",
      "content": "Conforme conversado no encontro, registrar situações da rotina que gostaria de retomar e observar as dificuldades encontradas na organização dos compromissos.",
      "guidance": {
        "status": "confirmed",
        "title": "Acompanhamento de rotina",
        "recipient": "Felipe Andrade Torres",
        "service": "",
        "contact": "",
        "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
        "professionalName": "Marina Duarte Vasconcelos",
        "professionalId": "",
        "internalNotes": "",
        "followup": "pending",
        "followupDate": "2026-11-03",
        "delivery": "not_recorded",
        "deliveryDate": "",
        "events": [],
        "revisions": []
      }
    },
    {
      "id": "demo_guidance_6",
      "patientId": "demo_patient_07",
      "kind": "referral",
      "start": "2026-10-29",
      "createdAt": "2026-11-04T21:56:43.531Z",
      "content": "Encaminhamento para avaliação complementar da demanda apresentada, com retorno ao acompanhamento para discussão das informações relevantes.",
      "guidance": {
        "status": "confirmed",
        "title": "Encaminhamento para avaliação complementar",
        "recipient": "Renata Almeida Freire",
        "service": "Avaliação complementar",
        "contact": "",
        "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
        "professionalName": "Marina Duarte Vasconcelos",
        "professionalId": "",
        "internalNotes": "",
        "followup": "awaiting_return",
        "followupDate": "2026-11-08",
        "delivery": "handover",
        "deliveryDate": "2026-11-02",
        "events": [
          {
            "id": "demo_guidance_event_6",
            "type": "handover",
            "date": "2026-11-02",
            "note": "Documento entregue ao paciente; retorno previsto para o próximo encontro.",
            "nextDate": "",
            "createdAt": "2026-11-04T21:56:43.534Z"
          }
        ],
        "revisions": [
          {
            "id": "demo_auto_291",
            "date": "2026-11-04T21:56:43.534Z",
            "action": "Registrar entrega em mãos",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_07",
              "kind": "referral",
              "start": "2026-10-29",
              "content": "Encaminhamento para avaliação complementar da demanda apresentada, com retorno ao acompanhamento para discussão das informações relevantes.",
              "guidance": {
                "status": "confirmed",
                "title": "Encaminhamento para avaliação complementar",
                "recipient": "Renata Almeida Freire",
                "service": "Avaliação complementar",
                "contact": "",
                "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
                "professionalName": "Marina Duarte Vasconcelos",
                "professionalId": "",
                "internalNotes": "",
                "followup": "awaiting_return",
                "followupDate": "2026-11-08",
                "delivery": "not_recorded",
                "deliveryDate": ""
              }
            }
          }
        ]
      },
      "updatedAt": "2026-11-04T21:56:43.534Z"
    },
    {
      "id": "demo_guidance_7",
      "patientId": "demo_patient_08",
      "kind": "orientation",
      "start": "2026-10-30",
      "createdAt": "2026-11-04T21:56:43.536Z",
      "content": "Conforme conversado no encontro, registrar situações da rotina que gostaria de retomar e observar as dificuldades encontradas na organização dos compromissos.",
      "guidance": {
        "status": "confirmed",
        "title": "Acompanhamento de rotina",
        "recipient": "Henrique Barros Almeida",
        "service": "",
        "contact": "",
        "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
        "professionalName": "Marina Duarte Vasconcelos",
        "professionalId": "",
        "internalNotes": "",
        "followup": "pending",
        "followupDate": "2026-11-03",
        "delivery": "not_recorded",
        "deliveryDate": "",
        "events": [],
        "revisions": []
      }
    },
    {
      "id": "demo_guidance_8",
      "patientId": "demo_patient_09",
      "kind": "orientation",
      "start": "2026-10-27",
      "createdAt": "2026-11-04T21:56:43.543Z",
      "content": "Conforme conversado no encontro, registrar situações da rotina que gostaria de retomar e observar as dificuldades encontradas na organização dos compromissos.",
      "guidance": {
        "status": "confirmed",
        "title": "Acompanhamento de rotina",
        "recipient": "Isabela Rocha Siqueira",
        "service": "",
        "contact": "",
        "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
        "professionalName": "Marina Duarte Vasconcelos",
        "professionalId": "",
        "internalNotes": "",
        "followup": "awaiting_return",
        "followupDate": "2026-11-08",
        "delivery": "handover",
        "deliveryDate": "2026-11-02",
        "events": [
          {
            "id": "demo_guidance_event_8",
            "type": "handover",
            "date": "2026-11-02",
            "note": "Documento entregue ao paciente; retorno previsto para o próximo encontro.",
            "nextDate": "",
            "createdAt": "2026-11-04T21:56:43.553Z"
          }
        ],
        "revisions": [
          {
            "id": "demo_auto_292",
            "date": "2026-11-04T21:56:43.553Z",
            "action": "Registrar entrega em mãos",
            "reason": "",
            "snapshot": {
              "patientId": "demo_patient_09",
              "kind": "orientation",
              "start": "2026-10-27",
              "content": "Conforme conversado no encontro, registrar situações da rotina que gostaria de retomar e observar as dificuldades encontradas na organização dos compromissos.",
              "guidance": {
                "status": "confirmed",
                "title": "Acompanhamento de rotina",
                "recipient": "Isabela Rocha Siqueira",
                "service": "",
                "contact": "",
                "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
                "professionalName": "Marina Duarte Vasconcelos",
                "professionalId": "",
                "internalNotes": "",
                "followup": "awaiting_return",
                "followupDate": "2026-11-08",
                "delivery": "not_recorded",
                "deliveryDate": ""
              }
            }
          }
        ]
      },
      "updatedAt": "2026-11-04T21:56:43.553Z"
    },
    {
      "id": "demo_guidance_9",
      "patientId": "demo_patient_10",
      "kind": "referral",
      "start": "2026-10-28",
      "createdAt": "2026-11-04T21:56:43.556Z",
      "content": "Encaminhamento para avaliação complementar da demanda apresentada, com retorno ao acompanhamento para discussão das informações relevantes.",
      "guidance": {
        "status": "confirmed",
        "title": "Encaminhamento para avaliação complementar",
        "recipient": "Renata Almeida Freire",
        "service": "Avaliação complementar",
        "contact": "",
        "purpose": "Continuidade do acompanhamento e articulação do cuidado.",
        "professionalName": "Marina Duarte Vasconcelos",
        "professionalId": "",
        "internalNotes": "",
        "followup": "pending",
        "followupDate": "2026-11-03",
        "delivery": "not_recorded",
        "deliveryDate": "",
        "events": [],
        "revisions": []
      }
    },
    {
      "id": "demo_guidance_draft",
      "patientId": "demo_patient_23",
      "kind": "orientation",
      "start": "2026-11-04",
      "createdAt": "2026-11-04T21:56:43.560Z",
      "content": "Pontos de acompanhamento a revisar com o paciente antes de concluir o documento.",
      "guidance": {
        "status": "draft",
        "title": "Orientação em elaboração",
        "recipient": "",
        "service": "",
        "contact": "",
        "purpose": "",
        "professionalName": "",
        "professionalId": "",
        "internalNotes": "",
        "followup": "none",
        "followupDate": "",
        "delivery": "not_recorded",
        "deliveryDate": "",
        "events": [],
        "revisions": []
      }
    }
  ],
  "emergencies": [
    {
      "id": "demo_emergency_1",
      "patientId": "demo_patient_06",
      "type": "crise_ansiedade",
      "riskLevel": "baixo",
      "date": "2026-10-25T14:00",
      "duration": 25,
      "intervention": "Relatou ansiedade intensa após situação de cobrança no trabalho. O contexto foi acolhido e os pontos principais ficaram registrados para retomada no acompanhamento.",
      "referrals": "Retorno ao acompanhamento regular para revisão do episódio.",
      "createdAt": "2026-10-25T14:30:00-03:00"
    }
  ],
  "financial": [
    {
      "id": "demo_auto_1",
      "patientId": "demo_patient_01",
      "packageId": "demo_pack_0",
      "source": "package",
      "type": "income",
      "description": "Pacote: Ciclo de 4 sessões",
      "category": "pacote",
      "date": "2026-09-09",
      "amount": 640,
      "paymentStatus": "paid",
      "paidAt": "2026-09-09",
      "paymentMethod": "pix",
      "createdAt": "2026-11-04T21:56:42.480Z"
    },
    {
      "id": "demo_auto_2",
      "patientId": "demo_patient_02",
      "packageId": "demo_pack_1",
      "source": "package",
      "type": "income",
      "description": "Pacote: Ciclo de 4 sessões",
      "category": "pacote",
      "date": "2026-09-09",
      "amount": 640,
      "paymentStatus": "paid",
      "paidAt": "2026-09-09",
      "paymentMethod": "credit",
      "createdAt": "2026-11-04T21:56:42.480Z"
    },
    {
      "id": "demo_auto_3",
      "patientId": "demo_patient_03",
      "packageId": "demo_pack_2",
      "source": "package",
      "type": "income",
      "description": "Pacote: Ciclo de 4 sessões",
      "category": "pacote",
      "date": "2026-09-09",
      "amount": 640,
      "paymentStatus": "paid",
      "paidAt": "2026-09-09",
      "paymentMethod": "pix",
      "createdAt": "2026-11-04T21:56:42.482Z"
    },
    {
      "id": "demo_auto_4",
      "patientId": "demo_patient_04",
      "packageId": "demo_pack_3",
      "source": "package",
      "type": "income",
      "description": "Pacote: Ciclo de 10 sessões",
      "category": "pacote",
      "date": "2026-09-09",
      "amount": 1600,
      "paymentStatus": "paid",
      "paidAt": "2026-09-09",
      "paymentMethod": "credit",
      "createdAt": "2026-11-04T21:56:42.482Z"
    },
    {
      "id": "demo_auto_5",
      "patientId": "demo_patient_05",
      "packageId": "demo_pack_4",
      "source": "package",
      "type": "income",
      "description": "Pacote: Ciclo de 10 sessões",
      "category": "pacote",
      "date": "2026-09-09",
      "amount": 1600,
      "paymentStatus": "paid",
      "paidAt": "2026-09-09",
      "paymentMethod": "pix",
      "createdAt": "2026-11-04T21:56:42.483Z"
    },
    {
      "id": "demo_auto_6",
      "patientId": "demo_patient_06",
      "packageId": "demo_pack_5",
      "source": "package",
      "type": "income",
      "description": "Pacote: Ciclo de 10 sessões",
      "category": "pacote",
      "date": "2026-09-09",
      "amount": 1600,
      "paymentStatus": "paid",
      "paidAt": "2026-09-09",
      "paymentMethod": "credit",
      "createdAt": "2026-11-04T21:56:42.483Z"
    },
    {
      "id": "demo_auto_7",
      "patientId": "demo_patient_07",
      "packageId": "demo_pack_6",
      "source": "package",
      "type": "income",
      "description": "Pacote: Ciclo de 10 sessões",
      "category": "pacote",
      "date": "2026-09-09",
      "amount": 1600,
      "paymentStatus": "paid",
      "paidAt": "2026-09-09",
      "paymentMethod": "pix",
      "createdAt": "2026-11-04T21:56:42.484Z"
    },
    {
      "id": "demo_auto_8",
      "patientId": "demo_patient_08",
      "packageId": "demo_pack_7",
      "source": "package",
      "type": "income",
      "description": "Pacote: Ciclo de 10 sessões",
      "category": "pacote",
      "date": "2026-09-09",
      "amount": 1600,
      "paymentStatus": "paid",
      "paidAt": "2026-09-09",
      "paymentMethod": "credit",
      "createdAt": "2026-11-04T21:56:42.484Z"
    },
    {
      "id": "demo_auto_9",
      "patientId": "demo_patient_09",
      "packageId": "demo_pack_8",
      "source": "package",
      "type": "income",
      "description": "Pacote: Ciclo de 10 sessões",
      "category": "pacote",
      "date": "2026-09-09",
      "amount": 1600,
      "paymentStatus": "paid",
      "paidAt": "2026-09-09",
      "paymentMethod": "pix",
      "createdAt": "2026-11-04T21:56:42.485Z"
    },
    {
      "id": "demo_auto_10",
      "patientId": "demo_patient_10",
      "packageId": "demo_pack_9",
      "source": "package",
      "type": "income",
      "description": "Pacote: Ciclo de 10 sessões",
      "category": "pacote",
      "date": "2026-09-09",
      "amount": 1600,
      "paymentStatus": "pending",
      "paymentMethod": "credit",
      "createdAt": "2026-11-04T21:56:42.485Z",
      "dueDate": "2026-09-20"
    },
    {
      "id": "demo_auto_11",
      "patientId": "demo_patient_13",
      "sessionId": "demo_session_demo_appointment_20260909_0",
      "appointmentId": "demo_appointment_20260909_0",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-09",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.518Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-09-12"
    },
    {
      "id": "demo_auto_12",
      "patientId": "demo_patient_15",
      "sessionId": "demo_session_demo_appointment_20260909_2",
      "appointmentId": "demo_appointment_20260909_2",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-09",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.521Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-12",
      "paidAt": "2026-09-09"
    },
    {
      "id": "demo_auto_13",
      "patientId": "demo_patient_16",
      "sessionId": "demo_session_demo_appointment_20260909_3",
      "appointmentId": "demo_appointment_20260909_3",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-09",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.523Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-12",
      "paidAt": "2026-09-09"
    },
    {
      "id": "demo_auto_14",
      "patientId": "demo_patient_17",
      "sessionId": "demo_session_demo_appointment_20260909_4",
      "appointmentId": "demo_appointment_20260909_4",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-09",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.524Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-12",
      "paidAt": "2026-09-09"
    },
    {
      "id": "demo_auto_15",
      "patientId": "demo_patient_18",
      "sessionId": "demo_session_demo_appointment_20260909_5",
      "appointmentId": "demo_appointment_20260909_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-09",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.525Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-12",
      "paidAt": "2026-09-09"
    },
    {
      "id": "demo_auto_16",
      "patientId": "demo_patient_19",
      "sessionId": "demo_session_demo_appointment_20260910_0",
      "appointmentId": "demo_appointment_20260910_0",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-10",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.526Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-13",
      "paidAt": "2026-09-10"
    },
    {
      "id": "demo_auto_17",
      "patientId": "demo_patient_20",
      "sessionId": "demo_session_demo_appointment_20260910_1",
      "appointmentId": "demo_appointment_20260910_1",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-10",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.527Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-13",
      "paidAt": "2026-09-10"
    },
    {
      "id": "demo_auto_18",
      "patientId": "demo_patient_27",
      "sessionId": "demo_session_demo_appointment_20260911_2",
      "appointmentId": "demo_appointment_20260911_2",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-11",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.528Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-09-14"
    },
    {
      "id": "demo_auto_19",
      "patientId": "demo_patient_28",
      "sessionId": "demo_session_demo_appointment_20260911_3",
      "appointmentId": "demo_appointment_20260911_3",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-11",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.530Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-14",
      "paidAt": "2026-09-11"
    },
    {
      "id": "demo_auto_20",
      "patientId": "demo_patient_29",
      "sessionId": "demo_session_demo_appointment_20260911_4",
      "appointmentId": "demo_appointment_20260911_4",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-11",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.534Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-14",
      "paidAt": "2026-09-11"
    },
    {
      "id": "demo_auto_21",
      "patientId": "demo_patient_30",
      "sessionId": "demo_session_demo_appointment_20260911_5",
      "appointmentId": "demo_appointment_20260911_5",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-11",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.536Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-14",
      "paidAt": "2026-09-11"
    },
    {
      "id": "demo_auto_31",
      "patientId": "demo_patient_11",
      "sessionId": "demo_session_demo_appointment_20260915_4",
      "appointmentId": "demo_appointment_20260915_4",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-15",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.554Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-18",
      "paidAt": "2026-09-15"
    },
    {
      "id": "demo_auto_32",
      "patientId": "demo_patient_12",
      "sessionId": "demo_session_demo_appointment_20260915_5",
      "appointmentId": "demo_appointment_20260915_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-15",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.555Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-09-18"
    },
    {
      "id": "demo_auto_33",
      "patientId": "demo_patient_13",
      "sessionId": "demo_session_demo_appointment_20260916_0",
      "appointmentId": "demo_appointment_20260916_0",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-16",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.556Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-19",
      "paidAt": "2026-09-16"
    },
    {
      "id": "demo_auto_34",
      "patientId": "demo_patient_14",
      "sessionId": "demo_session_demo_appointment_20260916_1",
      "appointmentId": "demo_appointment_20260916_1",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-16",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.557Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-19",
      "paidAt": "2026-09-16"
    },
    {
      "id": "demo_auto_35",
      "patientId": "demo_patient_15",
      "sessionId": "demo_session_demo_appointment_20260916_2",
      "appointmentId": "demo_appointment_20260916_2",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-16",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.557Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-19",
      "paidAt": "2026-09-16"
    },
    {
      "id": "demo_auto_36",
      "patientId": "demo_patient_16",
      "sessionId": "demo_session_demo_appointment_20260916_3",
      "appointmentId": "demo_appointment_20260916_3",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-16",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.558Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-19",
      "paidAt": "2026-09-16"
    },
    {
      "id": "demo_auto_37",
      "patientId": "demo_patient_17",
      "sessionId": "demo_session_demo_appointment_20260916_4",
      "appointmentId": "demo_appointment_20260916_4",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-16",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.560Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-19",
      "paidAt": "2026-09-16"
    },
    {
      "id": "demo_auto_38",
      "patientId": "demo_patient_18",
      "sessionId": "demo_session_demo_appointment_20260916_5",
      "appointmentId": "demo_appointment_20260916_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-16",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.562Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-19",
      "paidAt": "2026-09-16"
    },
    {
      "id": "demo_auto_39",
      "patientId": "demo_patient_19",
      "sessionId": "demo_session_demo_appointment_20260917_0",
      "appointmentId": "demo_appointment_20260917_0",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-17",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.565Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-09-20"
    },
    {
      "id": "demo_auto_40",
      "patientId": "demo_patient_20",
      "sessionId": "demo_session_demo_appointment_20260917_1",
      "appointmentId": "demo_appointment_20260917_1",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-17",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.567Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-20",
      "paidAt": "2026-09-17"
    },
    {
      "id": "demo_auto_41",
      "patientId": "demo_patient_27",
      "sessionId": "demo_session_demo_appointment_20260918_2",
      "appointmentId": "demo_appointment_20260918_2",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-18",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.569Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-21",
      "paidAt": "2026-09-18"
    },
    {
      "id": "demo_auto_42",
      "patientId": "demo_patient_28",
      "sessionId": "demo_session_demo_appointment_20260918_3",
      "appointmentId": "demo_appointment_20260918_3",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-18",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.570Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-21",
      "paidAt": "2026-09-18"
    },
    {
      "id": "demo_auto_43",
      "patientId": "demo_patient_29",
      "sessionId": "demo_session_demo_appointment_20260918_4",
      "appointmentId": "demo_appointment_20260918_4",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-18",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.572Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-21",
      "paidAt": "2026-09-18"
    },
    {
      "id": "demo_auto_44",
      "patientId": "demo_patient_30",
      "sessionId": "demo_session_demo_appointment_20260918_5",
      "appointmentId": "demo_appointment_20260918_5",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-18",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.573Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-21",
      "paidAt": "2026-09-18"
    },
    {
      "id": "demo_auto_54",
      "patientId": "demo_patient_11",
      "sessionId": "demo_session_demo_appointment_20260922_4",
      "appointmentId": "demo_appointment_20260922_4",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-22",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.589Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-25",
      "paidAt": "2026-09-22"
    },
    {
      "id": "demo_auto_55",
      "patientId": "demo_patient_12",
      "sessionId": "demo_session_demo_appointment_20260922_5",
      "appointmentId": "demo_appointment_20260922_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-22",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.590Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-25",
      "paidAt": "2026-09-22"
    },
    {
      "id": "demo_auto_56",
      "patientId": "demo_patient_13",
      "sessionId": "demo_session_demo_appointment_20260923_0",
      "appointmentId": "demo_appointment_20260923_0",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-23",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.592Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-26",
      "paidAt": "2026-09-23"
    },
    {
      "id": "demo_auto_57",
      "patientId": "demo_patient_14",
      "sessionId": "demo_session_demo_appointment_20260923_1",
      "appointmentId": "demo_appointment_20260923_1",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-23",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.593Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-26",
      "paidAt": "2026-09-23"
    },
    {
      "id": "demo_auto_58",
      "patientId": "demo_patient_15",
      "sessionId": "demo_session_demo_appointment_20260923_2",
      "appointmentId": "demo_appointment_20260923_2",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-23",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.595Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-26",
      "paidAt": "2026-09-23"
    },
    {
      "id": "demo_auto_59",
      "patientId": "demo_patient_16",
      "sessionId": "demo_session_demo_appointment_20260923_3",
      "appointmentId": "demo_appointment_20260923_3",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-23",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.596Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-26",
      "paidAt": "2026-09-23"
    },
    {
      "id": "demo_auto_60",
      "patientId": "demo_patient_18",
      "sessionId": "demo_session_demo_appointment_20260923_5",
      "appointmentId": "demo_appointment_20260923_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-23",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.598Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-09-26"
    },
    {
      "id": "demo_auto_61",
      "patientId": "demo_patient_19",
      "sessionId": "demo_session_demo_appointment_20260924_0",
      "appointmentId": "demo_appointment_20260924_0",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-24",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.600Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-27",
      "paidAt": "2026-09-24"
    },
    {
      "id": "demo_auto_62",
      "patientId": "demo_patient_20",
      "sessionId": "demo_session_demo_appointment_20260924_1",
      "appointmentId": "demo_appointment_20260924_1",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-24",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.601Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-27",
      "paidAt": "2026-09-24"
    },
    {
      "id": "demo_auto_63",
      "patientId": "demo_patient_27",
      "sessionId": "demo_session_demo_appointment_20260925_2",
      "appointmentId": "demo_appointment_20260925_2",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-25",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.603Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-28",
      "paidAt": "2026-09-25"
    },
    {
      "id": "demo_auto_64",
      "patientId": "demo_patient_28",
      "sessionId": "demo_session_demo_appointment_20260925_3",
      "appointmentId": "demo_appointment_20260925_3",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-25",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.605Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-28",
      "paidAt": "2026-09-25"
    },
    {
      "id": "demo_auto_65",
      "patientId": "demo_patient_29",
      "sessionId": "demo_session_demo_appointment_20260925_4",
      "appointmentId": "demo_appointment_20260925_4",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-25",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.606Z",
      "paymentMethod": "pix",
      "dueDate": "2026-09-28",
      "paidAt": "2026-09-25"
    },
    {
      "id": "demo_auto_76",
      "patientId": "demo_patient_12",
      "sessionId": "demo_session_demo_appointment_20260929_5",
      "appointmentId": "demo_appointment_20260929_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-29",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.624Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-02",
      "paidAt": "2026-09-29"
    },
    {
      "id": "demo_auto_77",
      "patientId": "demo_patient_13",
      "sessionId": "demo_session_demo_appointment_20260930_0",
      "appointmentId": "demo_appointment_20260930_0",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-30",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.625Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-03",
      "paidAt": "2026-09-30"
    },
    {
      "id": "demo_auto_78",
      "patientId": "demo_patient_14",
      "sessionId": "demo_session_demo_appointment_20260930_1",
      "appointmentId": "demo_appointment_20260930_1",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-30",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.627Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-03",
      "paidAt": "2026-09-30"
    },
    {
      "id": "demo_auto_79",
      "patientId": "demo_patient_15",
      "sessionId": "demo_session_demo_appointment_20260930_2",
      "appointmentId": "demo_appointment_20260930_2",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-30",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.629Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-03",
      "paidAt": "2026-09-30"
    },
    {
      "id": "demo_auto_80",
      "patientId": "demo_patient_16",
      "sessionId": "demo_session_demo_appointment_20260930_3",
      "appointmentId": "demo_appointment_20260930_3",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-30",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.630Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-03",
      "paidAt": "2026-09-30"
    },
    {
      "id": "demo_auto_81",
      "patientId": "demo_patient_17",
      "sessionId": "demo_session_demo_appointment_20260930_4",
      "appointmentId": "demo_appointment_20260930_4",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-30",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.632Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-10-03"
    },
    {
      "id": "demo_auto_82",
      "patientId": "demo_patient_18",
      "sessionId": "demo_session_demo_appointment_20260930_5",
      "appointmentId": "demo_appointment_20260930_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-09-30",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.633Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-03",
      "paidAt": "2026-09-30"
    },
    {
      "id": "demo_auto_83",
      "patientId": "demo_patient_19",
      "sessionId": "demo_session_demo_appointment_20261001_0",
      "appointmentId": "demo_appointment_20261001_0",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-01",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.635Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-04",
      "paidAt": "2026-10-01"
    },
    {
      "id": "demo_auto_84",
      "patientId": "demo_patient_20",
      "sessionId": "demo_session_demo_appointment_20261001_1",
      "appointmentId": "demo_appointment_20261001_1",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-01",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.636Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-04",
      "paidAt": "2026-10-01"
    },
    {
      "id": "demo_auto_85",
      "patientId": "demo_patient_27",
      "sessionId": "demo_session_demo_appointment_20261002_2",
      "appointmentId": "demo_appointment_20261002_2",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-02",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.638Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-05",
      "paidAt": "2026-10-02"
    },
    {
      "id": "demo_auto_86",
      "patientId": "demo_patient_28",
      "sessionId": "demo_session_demo_appointment_20261002_3",
      "appointmentId": "demo_appointment_20261002_3",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-02",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.639Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-05",
      "paidAt": "2026-10-02"
    },
    {
      "id": "demo_auto_87",
      "patientId": "demo_patient_29",
      "sessionId": "demo_session_demo_appointment_20261002_4",
      "appointmentId": "demo_appointment_20261002_4",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-02",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.641Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-05",
      "paidAt": "2026-10-02"
    },
    {
      "id": "demo_auto_88",
      "patientId": "demo_patient_30",
      "sessionId": "demo_session_demo_appointment_20261002_5",
      "appointmentId": "demo_appointment_20261002_5",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-02",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.643Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-10-05"
    },
    {
      "id": "demo_auto_99",
      "patientId": "demo_patient_11",
      "sessionId": "demo_session_demo_appointment_20261006_4",
      "appointmentId": "demo_appointment_20261006_4",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-06",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.663Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-09",
      "paidAt": "2026-10-06"
    },
    {
      "id": "demo_auto_100",
      "patientId": "demo_patient_12",
      "sessionId": "demo_session_demo_appointment_20261006_5",
      "appointmentId": "demo_appointment_20261006_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-06",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.667Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-09",
      "paidAt": "2026-10-06"
    },
    {
      "id": "demo_auto_101",
      "patientId": "demo_patient_13",
      "sessionId": "demo_session_demo_appointment_20261007_0",
      "appointmentId": "demo_appointment_20261007_0",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-07",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.671Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-10",
      "paidAt": "2026-10-07"
    },
    {
      "id": "demo_auto_102",
      "patientId": "demo_patient_14",
      "sessionId": "demo_session_demo_appointment_20261007_1",
      "appointmentId": "demo_appointment_20261007_1",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-07",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.674Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-10-10"
    },
    {
      "id": "demo_auto_103",
      "patientId": "demo_patient_15",
      "sessionId": "demo_session_demo_appointment_20261007_2",
      "appointmentId": "demo_appointment_20261007_2",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-07",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.677Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-10",
      "paidAt": "2026-10-07"
    },
    {
      "id": "demo_auto_104",
      "patientId": "demo_patient_16",
      "sessionId": "demo_session_demo_appointment_20261007_3",
      "appointmentId": "demo_appointment_20261007_3",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-07",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.679Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-10",
      "paidAt": "2026-10-07"
    },
    {
      "id": "demo_auto_105",
      "patientId": "demo_patient_17",
      "sessionId": "demo_session_demo_appointment_20261007_4",
      "appointmentId": "demo_appointment_20261007_4",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-07",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.681Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-10",
      "paidAt": "2026-10-07"
    },
    {
      "id": "demo_auto_106",
      "patientId": "demo_patient_18",
      "sessionId": "demo_session_demo_appointment_20261007_5",
      "appointmentId": "demo_appointment_20261007_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-07",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.684Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-10",
      "paidAt": "2026-10-07"
    },
    {
      "id": "demo_auto_107",
      "patientId": "demo_patient_19",
      "sessionId": "demo_session_demo_appointment_20261008_0",
      "appointmentId": "demo_appointment_20261008_0",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-08",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.689Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-11",
      "paidAt": "2026-10-08"
    },
    {
      "id": "demo_auto_108",
      "patientId": "demo_patient_27",
      "sessionId": "demo_session_demo_appointment_20261009_2",
      "appointmentId": "demo_appointment_20261009_2",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-09",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.692Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-12",
      "paidAt": "2026-10-09"
    },
    {
      "id": "demo_auto_109",
      "patientId": "demo_patient_28",
      "sessionId": "demo_session_demo_appointment_20261009_3",
      "appointmentId": "demo_appointment_20261009_3",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-09",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.694Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-10-12"
    },
    {
      "id": "demo_auto_110",
      "patientId": "demo_patient_29",
      "sessionId": "demo_session_demo_appointment_20261009_4",
      "appointmentId": "demo_appointment_20261009_4",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-09",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.696Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-12",
      "paidAt": "2026-10-09"
    },
    {
      "id": "demo_auto_111",
      "patientId": "demo_patient_30",
      "sessionId": "demo_session_demo_appointment_20261009_5",
      "appointmentId": "demo_appointment_20261009_5",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-09",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.698Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-12",
      "paidAt": "2026-10-09"
    },
    {
      "id": "demo_auto_115",
      "patientId": "demo_patient_11",
      "sessionId": "demo_session_demo_appointment_20261013_4",
      "appointmentId": "demo_appointment_20261013_4",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-13",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.711Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-16",
      "paidAt": "2026-10-13"
    },
    {
      "id": "demo_auto_116",
      "patientId": "demo_patient_12",
      "sessionId": "demo_session_demo_appointment_20261013_5",
      "appointmentId": "demo_appointment_20261013_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-13",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.713Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-10-16"
    },
    {
      "id": "demo_auto_117",
      "patientId": "demo_patient_13",
      "sessionId": "demo_session_demo_appointment_20261014_0",
      "appointmentId": "demo_appointment_20261014_0",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-14",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.715Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-17",
      "paidAt": "2026-10-14"
    },
    {
      "id": "demo_auto_118",
      "patientId": "demo_patient_14",
      "sessionId": "demo_session_demo_appointment_20261014_1",
      "appointmentId": "demo_appointment_20261014_1",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-14",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.717Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-17",
      "paidAt": "2026-10-14"
    },
    {
      "id": "demo_auto_119",
      "patientId": "demo_patient_15",
      "sessionId": "demo_session_demo_appointment_20261014_2",
      "appointmentId": "demo_appointment_20261014_2",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-14",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.720Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-17",
      "paidAt": "2026-10-14"
    },
    {
      "id": "demo_auto_120",
      "patientId": "demo_patient_16",
      "sessionId": "demo_session_demo_appointment_20261014_3",
      "appointmentId": "demo_appointment_20261014_3",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-14",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.726Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-17",
      "paidAt": "2026-10-14"
    },
    {
      "id": "demo_auto_121",
      "patientId": "demo_patient_17",
      "sessionId": "demo_session_demo_appointment_20261014_4",
      "appointmentId": "demo_appointment_20261014_4",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-14",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.732Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-17",
      "paidAt": "2026-10-14"
    },
    {
      "id": "demo_auto_122",
      "patientId": "demo_patient_18",
      "sessionId": "demo_session_demo_appointment_20261014_5",
      "appointmentId": "demo_appointment_20261014_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-14",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.734Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-17",
      "paidAt": "2026-10-14"
    },
    {
      "id": "demo_auto_123",
      "patientId": "demo_patient_19",
      "sessionId": "demo_session_demo_appointment_20261015_0",
      "appointmentId": "demo_appointment_20261015_0",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-15",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.737Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-10-18"
    },
    {
      "id": "demo_auto_124",
      "patientId": "demo_patient_20",
      "sessionId": "demo_session_demo_appointment_20261015_1",
      "appointmentId": "demo_appointment_20261015_1",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-15",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.742Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-18",
      "paidAt": "2026-10-15"
    },
    {
      "id": "demo_auto_125",
      "patientId": "demo_patient_01",
      "sessionId": "demo_session_demo_appointment_20261019_0",
      "appointmentId": "demo_appointment_20261019_0",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-19",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.747Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-22",
      "paidAt": "2026-10-19"
    },
    {
      "id": "demo_auto_126",
      "patientId": "demo_patient_02",
      "sessionId": "demo_session_demo_appointment_20261019_1",
      "appointmentId": "demo_appointment_20261019_1",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-19",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.753Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-22",
      "paidAt": "2026-10-19"
    },
    {
      "id": "demo_auto_134",
      "patientId": "demo_patient_11",
      "sessionId": "demo_session_demo_appointment_20261020_4",
      "appointmentId": "demo_appointment_20261020_4",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-20",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.785Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-23",
      "paidAt": "2026-10-20"
    },
    {
      "id": "demo_auto_135",
      "patientId": "demo_patient_12",
      "sessionId": "demo_session_demo_appointment_20261020_5",
      "appointmentId": "demo_appointment_20261020_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-20",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.789Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-23",
      "paidAt": "2026-10-20"
    },
    {
      "id": "demo_auto_136",
      "patientId": "demo_patient_13",
      "sessionId": "demo_session_demo_appointment_20261021_0",
      "appointmentId": "demo_appointment_20261021_0",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-21",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.792Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-24",
      "paidAt": "2026-10-21"
    },
    {
      "id": "demo_auto_137",
      "patientId": "demo_patient_14",
      "sessionId": "demo_session_demo_appointment_20261021_1",
      "appointmentId": "demo_appointment_20261021_1",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-21",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.796Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-10-24"
    },
    {
      "id": "demo_auto_138",
      "patientId": "demo_patient_15",
      "sessionId": "demo_session_demo_appointment_20261021_2",
      "appointmentId": "demo_appointment_20261021_2",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-21",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.799Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-24",
      "paidAt": "2026-10-21"
    },
    {
      "id": "demo_auto_139",
      "patientId": "demo_patient_17",
      "sessionId": "demo_session_demo_appointment_20261021_4",
      "appointmentId": "demo_appointment_20261021_4",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-21",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.804Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-24",
      "paidAt": "2026-10-21"
    },
    {
      "id": "demo_auto_140",
      "patientId": "demo_patient_18",
      "sessionId": "demo_session_demo_appointment_20261021_5",
      "appointmentId": "demo_appointment_20261021_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-21",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.806Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-24",
      "paidAt": "2026-10-21"
    },
    {
      "id": "demo_auto_141",
      "patientId": "demo_patient_19",
      "sessionId": "demo_session_demo_appointment_20261022_0",
      "appointmentId": "demo_appointment_20261022_0",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-22",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.808Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-25",
      "paidAt": "2026-10-22"
    },
    {
      "id": "demo_auto_142",
      "patientId": "demo_patient_20",
      "sessionId": "demo_session_demo_appointment_20261022_1",
      "appointmentId": "demo_appointment_20261022_1",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-22",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.811Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-25",
      "paidAt": "2026-10-22"
    },
    {
      "id": "demo_auto_143",
      "patientId": "demo_patient_21",
      "sessionId": "demo_session_demo_appointment_20261022_2",
      "appointmentId": "demo_appointment_20261022_2",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-22",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.813Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-25",
      "paidAt": "2026-10-22"
    },
    {
      "id": "demo_auto_144",
      "patientId": "demo_patient_22",
      "sessionId": "demo_session_demo_appointment_20261022_3",
      "appointmentId": "demo_appointment_20261022_3",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-22",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.817Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-10-25"
    },
    {
      "id": "demo_auto_145",
      "patientId": "demo_patient_23",
      "sessionId": "demo_session_demo_appointment_20261022_4",
      "appointmentId": "demo_appointment_20261022_4",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-22",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.820Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-25",
      "paidAt": "2026-10-22"
    },
    {
      "id": "demo_auto_146",
      "patientId": "demo_patient_24",
      "sessionId": "demo_session_demo_appointment_20261022_5",
      "appointmentId": "demo_appointment_20261022_5",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-22",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.823Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-25",
      "paidAt": "2026-10-22"
    },
    {
      "id": "demo_auto_147",
      "patientId": "demo_patient_01",
      "sessionId": "demo_session_demo_appointment_20261026_0",
      "appointmentId": "demo_appointment_20261026_0",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-26",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.825Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-29",
      "paidAt": "2026-10-26"
    },
    {
      "id": "demo_auto_148",
      "patientId": "demo_patient_02",
      "sessionId": "demo_session_demo_appointment_20261026_1",
      "appointmentId": "demo_appointment_20261026_1",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-26",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.829Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-29",
      "paidAt": "2026-10-26"
    },
    {
      "id": "demo_auto_149",
      "patientId": "demo_patient_03",
      "sessionId": "demo_session_demo_appointment_20261026_2",
      "appointmentId": "demo_appointment_20261026_2",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-26",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.831Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-29",
      "paidAt": "2026-10-26"
    },
    {
      "id": "demo_auto_157",
      "patientId": "demo_patient_11",
      "sessionId": "demo_session_demo_appointment_20261027_4",
      "appointmentId": "demo_appointment_20261027_4",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-27",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.857Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-30",
      "paidAt": "2026-10-27"
    },
    {
      "id": "demo_auto_158",
      "patientId": "demo_patient_12",
      "sessionId": "demo_session_demo_appointment_20261027_5",
      "appointmentId": "demo_appointment_20261027_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-27",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.860Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-10-30"
    },
    {
      "id": "demo_auto_159",
      "patientId": "demo_patient_13",
      "sessionId": "demo_session_demo_appointment_20261028_0",
      "appointmentId": "demo_appointment_20261028_0",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-28",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.864Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-31",
      "paidAt": "2026-10-28"
    },
    {
      "id": "demo_auto_160",
      "patientId": "demo_patient_14",
      "sessionId": "demo_session_demo_appointment_20261028_1",
      "appointmentId": "demo_appointment_20261028_1",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-28",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.868Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-31",
      "paidAt": "2026-10-28"
    },
    {
      "id": "demo_auto_161",
      "patientId": "demo_patient_15",
      "sessionId": "demo_session_demo_appointment_20261028_2",
      "appointmentId": "demo_appointment_20261028_2",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-28",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.873Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-31",
      "paidAt": "2026-10-28"
    },
    {
      "id": "demo_auto_162",
      "patientId": "demo_patient_16",
      "sessionId": "demo_session_demo_appointment_20261028_3",
      "appointmentId": "demo_appointment_20261028_3",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-28",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.879Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-31",
      "paidAt": "2026-10-28"
    },
    {
      "id": "demo_auto_163",
      "patientId": "demo_patient_18",
      "sessionId": "demo_session_demo_appointment_20261028_5",
      "appointmentId": "demo_appointment_20261028_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-28",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.885Z",
      "paymentMethod": "pix",
      "dueDate": "2026-10-31",
      "paidAt": "2026-10-28"
    },
    {
      "id": "demo_auto_164",
      "patientId": "demo_patient_19",
      "sessionId": "demo_session_demo_appointment_20261029_0",
      "appointmentId": "demo_appointment_20261029_0",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-29",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.888Z",
      "paymentMethod": "pix",
      "dueDate": "2026-11-01",
      "paidAt": "2026-10-29"
    },
    {
      "id": "demo_auto_165",
      "patientId": "demo_patient_20",
      "sessionId": "demo_session_demo_appointment_20261029_1",
      "appointmentId": "demo_appointment_20261029_1",
      "coverage": {
        "kind": "unspecified",
        "planId": "",
        "name": "Não informado",
        "color": "#64748B"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-29",
      "amount": 180,
      "paymentStatus": "pending",
      "createdAt": "2026-11-04T21:56:42.892Z",
      "paymentMethod": "unknown",
      "dueDate": "2026-11-01"
    },
    {
      "id": "demo_auto_166",
      "patientId": "demo_patient_21",
      "sessionId": "demo_session_demo_appointment_20261029_2",
      "appointmentId": "demo_appointment_20261029_2",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-29",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.894Z",
      "paymentMethod": "pix",
      "dueDate": "2026-11-01",
      "paidAt": "2026-10-29"
    },
    {
      "id": "demo_auto_167",
      "patientId": "demo_patient_22",
      "sessionId": "demo_session_demo_appointment_20261029_3",
      "appointmentId": "demo_appointment_20261029_3",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-29",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.897Z",
      "paymentMethod": "pix",
      "dueDate": "2026-11-01",
      "paidAt": "2026-10-29"
    },
    {
      "id": "demo_auto_168",
      "patientId": "demo_patient_23",
      "sessionId": "demo_session_demo_appointment_20261029_4",
      "appointmentId": "demo_appointment_20261029_4",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-10-29",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.900Z",
      "paymentMethod": "pix",
      "dueDate": "2026-11-01",
      "paidAt": "2026-10-29"
    },
    {
      "id": "demo_auto_171",
      "patientId": "demo_patient_09",
      "sessionId": "demo_session_demo_appointment_20261103_2",
      "appointmentId": "demo_appointment_20261103_2",
      "coverage": {
        "kind": "reimbursement",
        "planId": "",
        "name": "Particular com reembolso",
        "color": "#B45309"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-11-03",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.910Z",
      "paymentMethod": "pix",
      "dueDate": "2026-11-06",
      "paidAt": "2026-11-03"
    },
    {
      "id": "demo_auto_173",
      "patientId": "demo_patient_11",
      "sessionId": "demo_session_demo_appointment_20261103_4",
      "appointmentId": "demo_appointment_20261103_4",
      "coverage": {
        "kind": "private",
        "planId": "",
        "name": "Particular",
        "color": "#2563EB"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-11-03",
      "amount": 140,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.917Z",
      "paymentMethod": "pix",
      "dueDate": "2026-11-06",
      "paidAt": "2026-11-03"
    },
    {
      "id": "demo_auto_174",
      "patientId": "demo_patient_12",
      "sessionId": "demo_session_demo_appointment_20261103_5",
      "appointmentId": "demo_appointment_20261103_5",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_horizonte",
        "name": "Convênio Horizonte",
        "color": "#0F766E"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-11-03",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.920Z",
      "paymentMethod": "pix",
      "dueDate": "2026-11-06",
      "paidAt": "2026-11-03"
    },
    {
      "id": "demo_auto_175",
      "patientId": "demo_patient_13",
      "sessionId": "demo_session_demo_appointment_20261104_0",
      "appointmentId": "demo_appointment_20261104_0",
      "coverage": {
        "kind": "insurance",
        "planId": "demo_convenio_aurora",
        "name": "Convênio Aurora",
        "color": "#7C3AED"
      },
      "source": "session",
      "type": "income",
      "description": "Sessão avulsa",
      "category": "sessao",
      "date": "2026-11-04",
      "amount": 180,
      "paymentStatus": "paid",
      "createdAt": "2026-11-04T21:56:42.924Z",
      "paymentMethod": "pix",
      "dueDate": "2026-11-07",
      "paidAt": "2026-11-04"
    },
    {
      "id": "demo_expense_0_0",
      "patientId": null,
      "type": "expense",
      "description": "Aluguel do consultório",
      "category": "aluguel",
      "amount": 1850,
      "date": "2026-10-28",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.569Z",
      "paidAt": "2026-10-28"
    },
    {
      "id": "demo_expense_0_1",
      "patientId": null,
      "type": "expense",
      "description": "Internet e telefonia",
      "category": "outros",
      "amount": 139.9,
      "date": "2026-10-27",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.572Z",
      "paidAt": "2026-10-27"
    },
    {
      "id": "demo_expense_0_2",
      "patientId": null,
      "type": "expense",
      "description": "Materiais de escritório",
      "category": "material",
      "amount": 165,
      "date": "2026-10-26",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.578Z",
      "paidAt": "2026-10-26"
    },
    {
      "id": "demo_expense_0_3",
      "patientId": null,
      "type": "expense",
      "description": "Supervisão profissional",
      "category": "outros",
      "amount": 480,
      "date": "2026-10-25",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.581Z",
      "paidAt": "2026-10-25"
    },
    {
      "id": "demo_expense_0_4",
      "patientId": null,
      "type": "expense",
      "description": "Apoio administrativo",
      "category": "salario",
      "amount": 900,
      "date": "2026-10-24",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.584Z",
      "paidAt": "2026-10-24"
    },
    {
      "id": "demo_expense_1_0",
      "patientId": null,
      "type": "expense",
      "description": "Aluguel do consultório",
      "category": "aluguel",
      "amount": 1850,
      "date": "2026-09-30",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.587Z",
      "paidAt": "2026-09-30"
    },
    {
      "id": "demo_expense_1_1",
      "patientId": null,
      "type": "expense",
      "description": "Internet e telefonia",
      "category": "outros",
      "amount": 139.9,
      "date": "2026-09-29",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.590Z",
      "paidAt": "2026-09-29"
    },
    {
      "id": "demo_expense_1_2",
      "patientId": null,
      "type": "expense",
      "description": "Materiais de escritório",
      "category": "material",
      "amount": 165,
      "date": "2026-09-28",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.593Z",
      "paidAt": "2026-09-28"
    },
    {
      "id": "demo_expense_1_3",
      "patientId": null,
      "type": "expense",
      "description": "Supervisão profissional",
      "category": "outros",
      "amount": 480,
      "date": "2026-09-27",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.595Z",
      "paidAt": "2026-09-27"
    },
    {
      "id": "demo_expense_1_4",
      "patientId": null,
      "type": "expense",
      "description": "Apoio administrativo",
      "category": "salario",
      "amount": 900,
      "date": "2026-09-26",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.598Z",
      "paidAt": "2026-09-26"
    },
    {
      "id": "demo_expense_2_0",
      "patientId": null,
      "type": "expense",
      "description": "Aluguel do consultório",
      "category": "aluguel",
      "amount": 1850,
      "date": "2026-09-02",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.601Z",
      "paidAt": "2026-09-02"
    },
    {
      "id": "demo_expense_2_1",
      "patientId": null,
      "type": "expense",
      "description": "Internet e telefonia",
      "category": "outros",
      "amount": 139.9,
      "date": "2026-09-01",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.604Z",
      "paidAt": "2026-09-01"
    },
    {
      "id": "demo_expense_2_2",
      "patientId": null,
      "type": "expense",
      "description": "Materiais de escritório",
      "category": "material",
      "amount": 165,
      "date": "2026-08-31",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.606Z",
      "paidAt": "2026-08-31"
    },
    {
      "id": "demo_expense_2_3",
      "patientId": null,
      "type": "expense",
      "description": "Supervisão profissional",
      "category": "outros",
      "amount": 480,
      "date": "2026-08-30",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.608Z",
      "paidAt": "2026-08-30"
    },
    {
      "id": "demo_expense_2_4",
      "patientId": null,
      "type": "expense",
      "description": "Apoio administrativo",
      "category": "salario",
      "amount": 900,
      "date": "2026-08-29",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.612Z",
      "paidAt": "2026-08-29"
    },
    {
      "id": "demo_expense_pending",
      "patientId": null,
      "type": "expense",
      "description": "Aluguel do próximo período",
      "category": "aluguel",
      "amount": 1850,
      "date": "2026-11-04",
      "dueDate": "2026-11-11",
      "paymentStatus": "pending",
      "paymentMethod": "transfer",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.614Z"
    },
    {
      "id": "demo_cancelled_charge",
      "patientId": "demo_patient_16",
      "type": "income",
      "description": "Cobrança lançada por engano",
      "category": "outros",
      "amount": 180,
      "date": "2026-10-31",
      "dueDate": null,
      "paymentStatus": "pending",
      "paymentMethod": "unknown",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.618Z",
      "managementHistory": [
        {
          "id": "demo_auto_293",
          "at": "2026-11-04T21:56:43.621Z",
          "action": "Cobrança cancelada",
          "reason": "Lançamento duplicado identificado na conferência; cobrança cancelada sem recebimento.",
          "before": {
            "paymentStatus": "pending"
          }
        }
      ],
      "updatedAt": "2026-11-04T21:56:43.621Z",
      "cancelledAt": "2026-11-04T21:56:43.621Z",
      "cancelReason": "Lançamento duplicado identificado na conferência; cobrança cancelada sem recebimento."
    },
    {
      "id": "demo_refunded_charge",
      "patientId": "demo_patient_17",
      "type": "income",
      "description": "Reserva administrativa devolvida",
      "category": "outros",
      "amount": 90,
      "date": "2026-10-29",
      "dueDate": null,
      "paymentStatus": "paid",
      "paymentMethod": "pix",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.624Z",
      "paidAt": "2026-10-29",
      "managementHistory": [
        {
          "id": "demo_auto_294",
          "at": "2026-11-04T21:56:43.627Z",
          "action": "Devolução registrada",
          "reason": "Reserva devolvida após alteração da disponibilidade para o atendimento.",
          "before": {
            "paymentStatus": "paid"
          }
        }
      ],
      "updatedAt": "2026-11-04T21:56:43.627Z",
      "reversedAt": "2026-11-04T21:56:43.627Z",
      "reversalReason": "Reserva devolvida após alteração da disponibilidade para o atendimento."
    },
    {
      "id": "demo_auto_295",
      "originalId": "demo_refunded_charge",
      "patientId": "demo_patient_17",
      "type": "expense",
      "source": "reversal",
      "description": "Devolução: Reserva administrativa devolvida",
      "category": "devolucao",
      "amount": 90,
      "date": "2026-10-31",
      "paidAt": "2026-10-31",
      "createdAt": "2026-11-04T21:56:43.627Z",
      "paymentStatus": "paid",
      "paymentMethod": "pix",
      "reason": "Reserva devolvida após alteração da disponibilidade para o atendimento."
    },
    {
      "id": "rec_demo_rec_video_202611",
      "patientId": null,
      "type": "expense",
      "description": "Plataforma de videoconferência",
      "category": "Recorrente",
      "amount": 39,
      "date": "2026-11-01",
      "dueDate": "2026-11-15",
      "paymentStatus": "pending",
      "paymentMethod": "unknown",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.634Z",
      "recurringRuleId": "demo_rec_video",
      "recurringMonth": "2026-11"
    },
    {
      "id": "rec_demo_rec_domain_202611",
      "patientId": null,
      "type": "expense",
      "description": "Hospedagem e domínio",
      "category": "Recorrente",
      "amount": 49,
      "date": "2026-11-01",
      "dueDate": "2026-11-30",
      "paymentStatus": "pending",
      "paymentMethod": "unknown",
      "source": "manual",
      "createdAt": "2026-11-04T21:56:43.637Z",
      "recurringRuleId": "demo_rec_domain",
      "recurringMonth": "2026-11"
    }
  ],
  "packages": [
    {
      "id": "demo_pack_0",
      "patientId": "demo_patient_01",
      "name": "Ciclo de 4 sessões",
      "totalSessions": 4,
      "amount": 640,
      "date": "2026-09-09",
      "expiresAt": "2026-12-14",
      "paymentMethod": "pix",
      "createdAt": "2026-11-04T21:56:42.471Z"
    },
    {
      "id": "demo_pack_1",
      "patientId": "demo_patient_02",
      "name": "Ciclo de 4 sessões",
      "totalSessions": 4,
      "amount": 640,
      "date": "2026-09-09",
      "expiresAt": "2026-12-14",
      "paymentMethod": "credit",
      "createdAt": "2026-11-04T21:56:42.480Z"
    },
    {
      "id": "demo_pack_2",
      "patientId": "demo_patient_03",
      "name": "Ciclo de 4 sessões",
      "totalSessions": 4,
      "amount": 640,
      "date": "2026-09-09",
      "expiresAt": "2026-12-14",
      "paymentMethod": "pix",
      "createdAt": "2026-11-04T21:56:42.482Z"
    },
    {
      "id": "demo_pack_3",
      "patientId": "demo_patient_04",
      "name": "Ciclo de 10 sessões",
      "totalSessions": 10,
      "amount": 1600,
      "date": "2026-09-09",
      "expiresAt": "2026-12-14",
      "paymentMethod": "credit",
      "createdAt": "2026-11-04T21:56:42.482Z"
    },
    {
      "id": "demo_pack_4",
      "patientId": "demo_patient_05",
      "name": "Ciclo de 10 sessões",
      "totalSessions": 10,
      "amount": 1600,
      "date": "2026-09-09",
      "expiresAt": "2026-12-14",
      "paymentMethod": "pix",
      "createdAt": "2026-11-04T21:56:42.483Z"
    },
    {
      "id": "demo_pack_5",
      "patientId": "demo_patient_06",
      "name": "Ciclo de 10 sessões",
      "totalSessions": 10,
      "amount": 1600,
      "date": "2026-09-09",
      "expiresAt": "2026-12-14",
      "paymentMethod": "credit",
      "createdAt": "2026-11-04T21:56:42.483Z"
    },
    {
      "id": "demo_pack_6",
      "patientId": "demo_patient_07",
      "name": "Ciclo de 10 sessões",
      "totalSessions": 10,
      "amount": 1600,
      "date": "2026-09-09",
      "expiresAt": "2026-12-14",
      "paymentMethod": "pix",
      "createdAt": "2026-11-04T21:56:42.484Z"
    },
    {
      "id": "demo_pack_7",
      "patientId": "demo_patient_08",
      "name": "Ciclo de 10 sessões",
      "totalSessions": 10,
      "amount": 1600,
      "date": "2026-09-09",
      "expiresAt": "2026-12-14",
      "paymentMethod": "credit",
      "createdAt": "2026-11-04T21:56:42.484Z"
    },
    {
      "id": "demo_pack_8",
      "patientId": "demo_patient_09",
      "name": "Ciclo de 10 sessões",
      "totalSessions": 10,
      "amount": 1600,
      "date": "2026-09-09",
      "expiresAt": "2026-11-01",
      "paymentMethod": "pix",
      "createdAt": "2026-11-04T21:56:42.485Z"
    },
    {
      "id": "demo_pack_9",
      "patientId": "demo_patient_10",
      "name": "Ciclo de 10 sessões",
      "totalSessions": 10,
      "amount": 1600,
      "date": "2026-09-09",
      "expiresAt": "2026-12-14",
      "paymentMethod": "credit",
      "createdAt": "2026-11-04T21:56:42.485Z"
    }
  ],
  "packageMovements": [
    {
      "id": "demo_auto_22",
      "packageId": "demo_pack_0",
      "sessionId": "demo_session_demo_appointment_20260914_0",
      "appointmentId": "demo_appointment_20260914_0",
      "quantity": 1,
      "date": "2026-09-14"
    },
    {
      "id": "demo_auto_23",
      "packageId": "demo_pack_1",
      "sessionId": "demo_session_demo_appointment_20260914_1",
      "appointmentId": "demo_appointment_20260914_1",
      "quantity": 1,
      "date": "2026-09-14"
    },
    {
      "id": "demo_auto_24",
      "packageId": "demo_pack_2",
      "sessionId": "demo_session_demo_appointment_20260914_2",
      "appointmentId": "demo_appointment_20260914_2",
      "quantity": 1,
      "date": "2026-09-14"
    },
    {
      "id": "demo_auto_25",
      "packageId": "demo_pack_3",
      "sessionId": "demo_session_demo_appointment_20260914_3",
      "appointmentId": "demo_appointment_20260914_3",
      "quantity": 1,
      "date": "2026-09-14"
    },
    {
      "id": "demo_auto_26",
      "packageId": "demo_pack_4",
      "sessionId": "demo_session_demo_appointment_20260914_4",
      "appointmentId": "demo_appointment_20260914_4",
      "quantity": 1,
      "date": "2026-09-14"
    },
    {
      "id": "demo_auto_27",
      "packageId": "demo_pack_5",
      "sessionId": "demo_session_demo_appointment_20260914_5",
      "appointmentId": "demo_appointment_20260914_5",
      "quantity": 1,
      "date": "2026-09-14"
    },
    {
      "id": "demo_auto_28",
      "packageId": "demo_pack_6",
      "sessionId": "demo_session_demo_appointment_20260915_0",
      "appointmentId": "demo_appointment_20260915_0",
      "quantity": 1,
      "date": "2026-09-15"
    },
    {
      "id": "demo_auto_29",
      "packageId": "demo_pack_7",
      "sessionId": "demo_session_demo_appointment_20260915_1",
      "appointmentId": "demo_appointment_20260915_1",
      "quantity": 1,
      "date": "2026-09-15"
    },
    {
      "id": "demo_auto_30",
      "packageId": "demo_pack_9",
      "sessionId": "demo_session_demo_appointment_20260915_3",
      "appointmentId": "demo_appointment_20260915_3",
      "quantity": 1,
      "date": "2026-09-15"
    },
    {
      "id": "demo_auto_45",
      "packageId": "demo_pack_0",
      "sessionId": "demo_session_demo_appointment_20260921_0",
      "appointmentId": "demo_appointment_20260921_0",
      "quantity": 1,
      "date": "2026-09-21"
    },
    {
      "id": "demo_auto_46",
      "packageId": "demo_pack_1",
      "sessionId": "demo_session_demo_appointment_20260921_1",
      "appointmentId": "demo_appointment_20260921_1",
      "quantity": 1,
      "date": "2026-09-21"
    },
    {
      "id": "demo_auto_47",
      "packageId": "demo_pack_3",
      "sessionId": "demo_session_demo_appointment_20260921_3",
      "appointmentId": "demo_appointment_20260921_3",
      "quantity": 1,
      "date": "2026-09-21"
    },
    {
      "id": "demo_auto_48",
      "packageId": "demo_pack_4",
      "sessionId": "demo_session_demo_appointment_20260921_4",
      "appointmentId": "demo_appointment_20260921_4",
      "quantity": 1,
      "date": "2026-09-21"
    },
    {
      "id": "demo_auto_49",
      "packageId": "demo_pack_5",
      "sessionId": "demo_session_demo_appointment_20260921_5",
      "appointmentId": "demo_appointment_20260921_5",
      "quantity": 1,
      "date": "2026-09-21"
    },
    {
      "id": "demo_auto_50",
      "packageId": "demo_pack_6",
      "sessionId": "demo_session_demo_appointment_20260922_0",
      "appointmentId": "demo_appointment_20260922_0",
      "quantity": 1,
      "date": "2026-09-22"
    },
    {
      "id": "demo_auto_51",
      "packageId": "demo_pack_7",
      "sessionId": "demo_session_demo_appointment_20260922_1",
      "appointmentId": "demo_appointment_20260922_1",
      "quantity": 1,
      "date": "2026-09-22"
    },
    {
      "id": "demo_auto_52",
      "packageId": "demo_pack_8",
      "sessionId": "demo_session_demo_appointment_20260922_2",
      "appointmentId": "demo_appointment_20260922_2",
      "quantity": 1,
      "date": "2026-09-22"
    },
    {
      "id": "demo_auto_53",
      "packageId": "demo_pack_9",
      "sessionId": "demo_session_demo_appointment_20260922_3",
      "appointmentId": "demo_appointment_20260922_3",
      "quantity": 1,
      "date": "2026-09-22"
    },
    {
      "id": "demo_auto_66",
      "packageId": "demo_pack_0",
      "sessionId": "demo_session_demo_appointment_20260928_0",
      "appointmentId": "demo_appointment_20260928_0",
      "quantity": 1,
      "date": "2026-09-28"
    },
    {
      "id": "demo_auto_67",
      "packageId": "demo_pack_1",
      "sessionId": "demo_session_demo_appointment_20260928_1",
      "appointmentId": "demo_appointment_20260928_1",
      "quantity": 1,
      "date": "2026-09-28"
    },
    {
      "id": "demo_auto_68",
      "packageId": "demo_pack_2",
      "sessionId": "demo_session_demo_appointment_20260928_2",
      "appointmentId": "demo_appointment_20260928_2",
      "quantity": 1,
      "date": "2026-09-28"
    },
    {
      "id": "demo_auto_69",
      "packageId": "demo_pack_3",
      "sessionId": "demo_session_demo_appointment_20260928_3",
      "appointmentId": "demo_appointment_20260928_3",
      "quantity": 1,
      "date": "2026-09-28"
    },
    {
      "id": "demo_auto_70",
      "packageId": "demo_pack_4",
      "sessionId": "demo_session_demo_appointment_20260928_4",
      "appointmentId": "demo_appointment_20260928_4",
      "quantity": 1,
      "date": "2026-09-28"
    },
    {
      "id": "demo_auto_71",
      "packageId": "demo_pack_5",
      "sessionId": "demo_session_demo_appointment_20260928_5",
      "appointmentId": "demo_appointment_20260928_5",
      "quantity": 1,
      "date": "2026-09-28"
    },
    {
      "id": "demo_auto_72",
      "packageId": "demo_pack_6",
      "sessionId": "demo_session_demo_appointment_20260929_0",
      "appointmentId": "demo_appointment_20260929_0",
      "quantity": 1,
      "date": "2026-09-29"
    },
    {
      "id": "demo_auto_73",
      "packageId": "demo_pack_7",
      "sessionId": "demo_session_demo_appointment_20260929_1",
      "appointmentId": "demo_appointment_20260929_1",
      "quantity": 1,
      "date": "2026-09-29"
    },
    {
      "id": "demo_auto_74",
      "packageId": "demo_pack_8",
      "sessionId": "demo_session_demo_appointment_20260929_2",
      "appointmentId": "demo_appointment_20260929_2",
      "quantity": 1,
      "date": "2026-09-29"
    },
    {
      "id": "demo_auto_75",
      "packageId": "demo_pack_9",
      "sessionId": "demo_session_demo_appointment_20260929_3",
      "appointmentId": "demo_appointment_20260929_3",
      "quantity": 1,
      "date": "2026-09-29"
    },
    {
      "id": "demo_auto_89",
      "packageId": "demo_pack_0",
      "sessionId": "demo_session_demo_appointment_20261005_0",
      "appointmentId": "demo_appointment_20261005_0",
      "quantity": 1,
      "date": "2026-10-05"
    },
    {
      "id": "demo_auto_90",
      "packageId": "demo_pack_1",
      "sessionId": "demo_session_demo_appointment_20261005_1",
      "appointmentId": "demo_appointment_20261005_1",
      "quantity": 1,
      "date": "2026-10-05"
    },
    {
      "id": "demo_auto_91",
      "packageId": "demo_pack_2",
      "sessionId": "demo_session_demo_appointment_20261005_2",
      "appointmentId": "demo_appointment_20261005_2",
      "quantity": 1,
      "date": "2026-10-05"
    },
    {
      "id": "demo_auto_92",
      "packageId": "demo_pack_3",
      "sessionId": "demo_session_demo_appointment_20261005_3",
      "appointmentId": "demo_appointment_20261005_3",
      "quantity": 1,
      "date": "2026-10-05"
    },
    {
      "id": "demo_auto_93",
      "packageId": "demo_pack_4",
      "sessionId": "demo_session_demo_appointment_20261005_4",
      "appointmentId": "demo_appointment_20261005_4",
      "quantity": 1,
      "date": "2026-10-05"
    },
    {
      "id": "demo_auto_94",
      "packageId": "demo_pack_5",
      "sessionId": "demo_session_demo_appointment_20261005_5",
      "appointmentId": "demo_appointment_20261005_5",
      "quantity": 1,
      "date": "2026-10-05"
    },
    {
      "id": "demo_auto_95",
      "packageId": "demo_pack_6",
      "sessionId": "demo_session_demo_appointment_20261006_0",
      "appointmentId": "demo_appointment_20261006_0",
      "quantity": 1,
      "date": "2026-10-06"
    },
    {
      "id": "demo_auto_96",
      "packageId": "demo_pack_7",
      "sessionId": "demo_session_demo_appointment_20261006_1",
      "appointmentId": "demo_appointment_20261006_1",
      "quantity": 1,
      "date": "2026-10-06"
    },
    {
      "id": "demo_auto_97",
      "packageId": "demo_pack_8",
      "sessionId": "demo_session_demo_appointment_20261006_2",
      "appointmentId": "demo_appointment_20261006_2",
      "quantity": 1,
      "date": "2026-10-06"
    },
    {
      "id": "demo_auto_98",
      "packageId": "demo_pack_9",
      "sessionId": "demo_session_demo_appointment_20261006_3",
      "appointmentId": "demo_appointment_20261006_3",
      "quantity": 1,
      "date": "2026-10-06"
    },
    {
      "id": "demo_auto_112",
      "packageId": "demo_pack_6",
      "sessionId": "demo_session_demo_appointment_20261013_0",
      "appointmentId": "demo_appointment_20261013_0",
      "quantity": 1,
      "date": "2026-10-13"
    },
    {
      "id": "demo_auto_113",
      "packageId": "demo_pack_8",
      "sessionId": "demo_session_demo_appointment_20261013_2",
      "appointmentId": "demo_appointment_20261013_2",
      "quantity": 1,
      "date": "2026-10-13"
    },
    {
      "id": "demo_auto_114",
      "packageId": "demo_pack_9",
      "sessionId": "demo_session_demo_appointment_20261013_3",
      "appointmentId": "demo_appointment_20261013_3",
      "quantity": 1,
      "date": "2026-10-13"
    },
    {
      "id": "demo_auto_127",
      "packageId": "demo_pack_2",
      "sessionId": "demo_session_demo_appointment_20261019_2",
      "appointmentId": "demo_appointment_20261019_2",
      "quantity": 1,
      "date": "2026-10-19"
    },
    {
      "id": "demo_auto_128",
      "packageId": "demo_pack_3",
      "sessionId": "demo_session_demo_appointment_20261019_3",
      "appointmentId": "demo_appointment_20261019_3",
      "quantity": 1,
      "date": "2026-10-19"
    },
    {
      "id": "demo_auto_129",
      "packageId": "demo_pack_4",
      "sessionId": "demo_session_demo_appointment_20261019_4",
      "appointmentId": "demo_appointment_20261019_4",
      "quantity": 1,
      "date": "2026-10-19"
    },
    {
      "id": "demo_auto_130",
      "packageId": "demo_pack_5",
      "sessionId": "demo_session_demo_appointment_20261019_5",
      "appointmentId": "demo_appointment_20261019_5",
      "quantity": 1,
      "date": "2026-10-19"
    },
    {
      "id": "demo_auto_131",
      "packageId": "demo_pack_6",
      "sessionId": "demo_session_demo_appointment_20261020_0",
      "appointmentId": "demo_appointment_20261020_0",
      "quantity": 1,
      "date": "2026-10-20"
    },
    {
      "id": "demo_auto_132",
      "packageId": "demo_pack_7",
      "sessionId": "demo_session_demo_appointment_20261020_1",
      "appointmentId": "demo_appointment_20261020_1",
      "quantity": 1,
      "date": "2026-10-20"
    },
    {
      "id": "demo_auto_133",
      "packageId": "demo_pack_9",
      "sessionId": "demo_session_demo_appointment_20261020_3",
      "appointmentId": "demo_appointment_20261020_3",
      "quantity": 1,
      "date": "2026-10-20"
    },
    {
      "id": "demo_auto_150",
      "packageId": "demo_pack_3",
      "sessionId": "demo_session_demo_appointment_20261026_3",
      "appointmentId": "demo_appointment_20261026_3",
      "quantity": 1,
      "date": "2026-10-26"
    },
    {
      "id": "demo_auto_151",
      "packageId": "demo_pack_4",
      "sessionId": "demo_session_demo_appointment_20261026_4",
      "appointmentId": "demo_appointment_20261026_4",
      "quantity": 1,
      "date": "2026-10-26"
    },
    {
      "id": "demo_auto_152",
      "packageId": "demo_pack_5",
      "sessionId": "demo_session_demo_appointment_20261026_5",
      "appointmentId": "demo_appointment_20261026_5",
      "quantity": 1,
      "date": "2026-10-26"
    },
    {
      "id": "demo_auto_153",
      "packageId": "demo_pack_6",
      "sessionId": "demo_session_demo_appointment_20261027_0",
      "appointmentId": "demo_appointment_20261027_0",
      "quantity": 1,
      "date": "2026-10-27"
    },
    {
      "id": "demo_auto_154",
      "packageId": "demo_pack_7",
      "sessionId": "demo_session_demo_appointment_20261027_1",
      "appointmentId": "demo_appointment_20261027_1",
      "quantity": 1,
      "date": "2026-10-27"
    },
    {
      "id": "demo_auto_155",
      "packageId": "demo_pack_8",
      "sessionId": "demo_session_demo_appointment_20261027_2",
      "appointmentId": "demo_appointment_20261027_2",
      "quantity": 1,
      "date": "2026-10-27"
    },
    {
      "id": "demo_auto_156",
      "packageId": "demo_pack_9",
      "sessionId": "demo_session_demo_appointment_20261027_3",
      "appointmentId": "demo_appointment_20261027_3",
      "quantity": 1,
      "date": "2026-10-27"
    },
    {
      "id": "demo_auto_169",
      "packageId": "demo_pack_6",
      "sessionId": "demo_session_demo_appointment_20261103_0",
      "appointmentId": "demo_appointment_20261103_0",
      "quantity": 1,
      "date": "2026-11-03"
    },
    {
      "id": "demo_auto_170",
      "packageId": "demo_pack_7",
      "sessionId": "demo_session_demo_appointment_20261103_1",
      "appointmentId": "demo_appointment_20261103_1",
      "quantity": 1,
      "date": "2026-11-03"
    },
    {
      "id": "demo_auto_172",
      "packageId": "demo_pack_9",
      "sessionId": "demo_session_demo_appointment_20261103_3",
      "appointmentId": "demo_appointment_20261103_3",
      "quantity": 1,
      "date": "2026-11-03"
    }
  ]
};
