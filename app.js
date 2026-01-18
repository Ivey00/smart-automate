/**
 * SmartAutomate - Frontend Application
 * Version: 1.0
 * Automatisation Intelligente pour PME Marocaines
 */

// ===================================
// Configuration
// ===================================
const CONFIG = {
    API_BASE_URL: 'https://smart-automate-pp.app.n8n.cloud/webhook',
    ENDPOINTS: {
        'email-manager': '/smart-email-manager',
        'invoice-generator': '/smart-invoice-generator',
        'expense-tracker': '/smart-expense-tracker',
        'social-publisher': '/smart-social-publisher',
        'news-digest': '/news-digest',
        'meeting-reminder': '/smart-meeting-reminder',
        'doc-summarizer': '/smart-doc-summarizer',
        'career-builder': '/smart-career-builder',
        'order-manager': '/smart-order-manager',
        'chatbot': '/chatbot'
    }
};

// ===================================
// DOM Elements
// ===================================
const elements = {
    preloader: document.getElementById('preloader'),
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('nav-menu'),
    navToggle: document.getElementById('nav-toggle'),
    modalOverlay: document.getElementById('modal-overlay'),
    toast: document.getElementById('toast'),
    chatContainer: document.getElementById('chat-container')
};

// ===================================
// Preloader
// ===================================
window.addEventListener('load', () => {
    setTimeout(() => {
        elements.preloader.classList.add('hidden');
    }, 1000);
});

// ===================================
// Navigation
// ===================================
// Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        elements.navbar.classList.add('scrolled');
    } else {
        elements.navbar.classList.remove('scrolled');
    }

    // Update active nav link
    updateActiveNavLink();
});

// Mobile Menu Toggle
elements.navToggle?.addEventListener('click', () => {
    elements.navMenu.classList.toggle('active');
    elements.navToggle.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        elements.navMenu.classList.remove('active');
        elements.navToggle.classList.remove('active');
    });
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

// ===================================
// Counter Animation
// ===================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// Initialize counters
document.addEventListener('DOMContentLoaded', animateCounters);

// ===================================
// Modal Management
// ===================================
let currentModal = null;

function openModal(automationId) {
    const modal = document.getElementById(`modal-${automationId}`);

    if (modal) {
        // Close any existing modal
        if (currentModal) {
            closeModal();
        }

        // Show overlay and modal
        elements.modalOverlay.classList.add('active');
        modal.classList.add('active');
        currentModal = modal;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Reset form and result
        const form = modal.querySelector('form');
        const result = modal.querySelector('.modal-result');
        if (form) form.reset();
        if (result) {
            result.classList.remove('show', 'success', 'error');
            result.innerHTML = '';
        }
    }
}

function closeModal() {
    if (currentModal) {
        elements.modalOverlay.classList.remove('active');
        currentModal.classList.remove('active');
        currentModal = null;
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
elements.modalOverlay?.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentModal) {
        closeModal();
    }
});

// ===================================
// Form Submission Handler
// ===================================
async function submitForm(event, automationId) {
    event.preventDefault();

    const form = event.target;
    const resultDiv = document.getElementById(`result-${automationId}`);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Traitement...';

    // Collect form data
    const formData = new FormData(form);
    let data = {};

    // Special handling for different forms
    switch (automationId) {
        case 'career-builder':
            data = {
                // Personal Info
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                birth_date: formData.get('birth_date'),
                linkedin: formData.get('linkedin'),
                portfolio: formData.get('portfolio'),
                // Profile
                profile_title: formData.get('profile_title'),
                profile_summary: formData.get('profile_summary'),
                career_objective: formData.get('career_objective'),
                // Skills
                technical_skills: (formData.get('technical_skills') || '').split(',').map(s => s.trim()),
                soft_skills: (formData.get('soft_skills') || '').split(',').map(s => s.trim()),
                languages: (formData.get('languages') || '').split(',').map(s => s.trim()),
                // Job Target
                target_company: formData.get('target_company'),
                target_position: formData.get('target_position'),
                why_company: formData.get('why_company'),
                why_position: formData.get('why_position'),
                // Dynamic Fields
                experiences: [{
                    position: formData.get('exp_position'),
                    company: formData.get('exp_company'),
                    period: formData.get('exp_period'),
                    description: formData.get('exp_desc'),
                    achievements: []
                }],
                education: [{
                    degree: formData.get('edu_degree'),
                    institution: formData.get('edu_school'),
                    year: formData.get('edu_year'),
                    details: formData.get('edu_details')
                }]
            };
            break;

        case 'order-manager':
            let items;
            try {
                items = JSON.parse(formData.get('items') || '[]');
            } catch (e) {
                items = [{ nom: "Produit Test", prix: 100, quantite: 1 }];
            }
            data = {
                client: {
                    nom: formData.get('customer_name'),
                    email: formData.get('customer_email'),
                    telephone: formData.get('customer_phone')
                },
                produits: items,
                adresse_livraison: formData.get('shipping_address') + ", " + formData.get('city'),
                mode_paiement: formData.get('payment_method')
            };
            break;

        case 'meeting-reminder':
            const startTime = new Date(formData.get('start_time'));
            data = {
                title: formData.get('title'),
                start_time: startTime.toISOString(),
                location: formData.get('location') || '',
                meeting_type: formData.get('meeting_type')
            };
            break;

        case 'news-digest':
            data = {
                keyword: formData.get('keyword'),
                language: formData.get('language'),
                max_articles: parseInt(formData.get('max_articles')) || 5
            };
            break;

        case 'expense-tracker':
            data = {
                amount: parseFloat(formData.get('amount')),
                category: formData.get('category') || null,
                merchant: formData.get('merchant') || '',
                description: formData.get('description') || ''
            };
            break;

        case 'invoice-generator':
            data = {
                clientName: formData.get('clientName'),
                clientEmail: formData.get('clientEmail'),
                description: formData.get('description'),
                montantHT: parseFloat(formData.get('montantHT'))
            };
            break;

        default:
            formData.forEach((value, key) => {
                data[key] = value;
            });
    }

    try {
        // Make API call
        const response = await callAPI(automationId, data);

        // Show success result
        resultDiv.innerHTML = formatAutomationResponse(automationId, response);
        resultDiv.classList.add('show', 'success');
        if (automationId === 'email-manager' || automationId === 'news-digest' || automationId === 'order-manager') {
            resultDiv.classList.add('styled');
        } else if (automationId === 'career-builder') {
            resultDiv.classList.add('styled');
            // Add PDF download button logic
            const pdfBtnDiv = document.getElementById('pdf-download-container');
            if (pdfBtnDiv) {
                pdfBtnDiv.innerHTML = `<button id='download-pdf-btn' type='button' class='btn btn-primary' style='margin-bottom:15px; width: 100%;'><i class="fas fa-download"></i> Télécharger le CV en PDF Professionnel</button>`;
                document.getElementById('download-pdf-btn').onclick = async function () {
                    try {
                        showToast('Génération du PDF professionnel en cours...', 'success');
                        const pdfData = { ...response, formData: data };
                        await generatePDFWithJsPDF(pdfData);
                        showToast('PDF professionnel généré avec succès!', 'success');
                    } catch (error) {
                        console.error('Erreur PDF:', error);
                        showToast('Erreur lors de la génération: ' + error.message, 'error');
                    }
                };
            }
        }
        resultDiv.classList.remove('error');

        showToast('Requete executee avec succes!', 'success');

    } catch (error) {
        // Show error result
        resultDiv.innerHTML = `<pre>${JSON.stringify({
            success: false,
            error: error.message || 'Une erreur est survenue'
        }, null, 2)}</pre>`;
        resultDiv.classList.add('show', 'error');
        resultDiv.classList.remove('success');

        showToast('Erreur lors de la requete', 'error');
    }

    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
}

// ===================================
// Response Formatter
// ===================================
function formatAutomationResponse(automationId, response) {
    if (automationId === 'email-manager' && response.success) {
        const category = response.category || 'NORMAL';
        const badgeClass = category === 'URGENT' ? 'badge-urgent' : 'badge-normal';

        // n8n might send nested body or flat structure
        const emailInfo = response.email || {};
        const displayData = {
            from: emailInfo.body?.from || emailInfo.from || 'Non spécifié',
            subject: emailInfo.body?.subject || emailInfo.subject || 'Sans objet',
            body: emailInfo.body?.body || emailInfo.body || 'Aucun contenu extrait.'
        };

        return `
            <div class="response-card">
                <div class="response-header">
                    <div class="response-title">
                        <i class="fas fa-robot"></i> Analyse IA Terminée
                    </div>
                    <span class="response-badge ${badgeClass}">${category}</span>
                </div>
                <div class="response-body">
                    <div class="email-meta">
                        <div class="meta-row">
                            <span class="meta-label">De:</span>
                            <span class="meta-value">${displayData.from}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Objet:</span>
                            <span class="meta-value">${displayData.subject}</span>
                        </div>
                    </div>
                    <div class="email-content-box">
                        ${displayData.body}
                    </div>
                    <div class="action-taken">
                        <i class="fas fa-bolt"></i>
                        <span>Action: ${response.action || 'Email classé automatiquement'}</span>
                    </div>
                </div>
                <div class="response-footer">
                    <i class="far fa-clock"></i> ${new Date(response.timestamp || Date.now()).toLocaleString('fr-FR')}
                </div>
            </div>
        `;
    }

    if (automationId === 'career-builder' && response.success) {
        const cv = response.documents?.cv || {};
        const app = response.application || {};

        return `
            <div class="response-card">
                <div class="response-header">
                    <div class="response-title">
                        <i class="fas fa-user-tie"></i> CV & Lettre de Motivation
                    </div>
                    <span class="response-badge badge-success">Généré</span>
                </div>
                <div class="response-body">
                    <div class="email-meta">
                        <div class="meta-row">
                            <span class="meta-label">Candidat:</span>
                            <span class="meta-value">${app.candidate || 'Non spécifié'}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Poste:</span>
                            <span class="meta-value">${app.position || 'Non spécifié'}</span>
                        </div>
                    </div>
                    
                    <div class="response-title" style="margin: 1.5rem 0 0.75rem;">
                        <i class="fas fa-eye"></i> Aperçu du CV
                    </div>
                    <div class="email-content-box" style="font-style: normal; font-size: 0.85rem; max-height: 250px; overflow-y: auto;">
                        ${cv.html_content || 'Aperçu non disponible. Téléchargez le PDF pour voir le document complet.'}
                    </div>

                    <div class="response-title" style="margin: 1.5rem 0 0.75rem;">
                        <i class="fas fa-list-check"></i> Prochaines Étapes
                    </div>
                    <div style="font-size: 0.875rem; color: var(--gray-600);">
                        ${(response.next_steps || []).map(step => `<div style="margin-bottom: 0.35rem;"><i class="fas fa-chevron-right" style="color: var(--primary-cyan); font-size: 0.7rem;"></i> ${step}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    if (automationId === 'order-manager') {
        const isSuccess = response.accepted && response.accepted.length > 0;
        const recipient = isSuccess ? response.accepted[0] : 'Non spécifié';

        return `
            <div class="response-card">
                <div class="response-header">
                    <div class="response-title">
                        <i class="fas fa-shopping-basket"></i> Commande Enregistrée
                    </div>
                    <span class="response-badge ${isSuccess ? 'badge-success' : 'badge-urgent'}">
                        ${isSuccess ? 'Confirmée' : 'Erreur Envoi'}
                    </span>
                </div>
                <div class="response-body">
                    <div class="action-taken" style="margin-bottom: 1.5rem;">
                        <i class="fas fa-check-circle"></i>
                        <span>La commande a été traitée avec succès.</span>
                    </div>
                    
                    <div class="email-meta">
                        <div class="meta-row">
                            <span class="meta-label">Client (Email):</span>
                            <span class="meta-value">${recipient}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">ID Message:</span>
                            <span class="meta-value" style="font-size: 0.75rem; font-family: monospace;">${response.messageId || 'N/A'}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">Réponse Serveur:</span>
                            <span class="meta-value" style="font-size: 0.75rem; font-style: italic; font-weight: 400;">${response.response || 'N/A'}</span>
                        </div>
                    </div>

                    <div style="background: var(--gray-50); padding: 1rem; border-radius: var(--radius); font-size: 0.85rem; color: var(--gray-600);">
                        <i class="fas fa-info-circle" style="color: var(--primary-cyan); margin-right: 5px;"></i>
                        Un email de confirmation a été envoyé automatiquement au client et au vendeur.
                    </div>
                </div>
                <div class="response-footer">
                    <i class="fas fa-microchip"></i> Traité via SmartAutomate Engine
                </div>
            </div>
        `;
    }

    if (automationId === 'news-digest') {
        const data = Array.isArray(response) ? response[0] : response;
        const articles = data.articles?.[0]?.json?.data || [];
        const sujet = data.sujet || 'Actualités';

        return `
            <div class="response-card">
                <div class="response-header">
                    <div class="response-title">
                        <i class="fas fa-newspaper"></i> Digest d'Actualités: ${sujet}
                    </div>
                    <span class="response-badge badge-normal">${articles.length} Articles</span>
                </div>
                <div class="response-body">
                    <div class="digest-meta" style="margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--gray-500);">
                        <i class="far fa-calendar-alt"></i> Date: ${new Date().toLocaleDateString('fr-FR')}
                    </div>
                    <div class="articles-list" style="display: flex; flex-direction: column; gap: 1rem;">
                        ${articles.map((art, idx) => `
                            <div class="article-item" style="padding: 1.25rem; background: var(--gray-50); border-radius: var(--radius); border-left: 4px solid var(--primary-orange);">
                                <div style="font-weight: 700; color: var(--primary-blue); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="background: var(--primary-blue); color: white; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.75rem;">${idx + 1}</span>
                                    Article IA
                                </div>
                                <div class="article-content" style="font-size: 0.9375rem; line-height: 1.6; color: var(--gray-800);">
                                    ${art.message?.content || 'Contenu non disponible'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="response-footer">
                    Généré par SmartAutomate IA
                </div>
            </div>
        `;
    }

    // Default fallback to JSON pre
    return `<pre>${JSON.stringify(response, null, 2)}</pre>`;
}

// ===================================
// API Call Function
// ===================================
async function callAPI(automationId, data) {
    const endpoint = CONFIG.ENDPOINTS[automationId];
    const url = CONFIG.API_BASE_URL + endpoint;

    console.log('Calling API:', url, data);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('API Error:', error);

        if (automationId === 'chatbot') {
            throw error;
        }

        // Return simulated response for demo
        return simulateResponse(automationId, data);
    }
}

// ===================================
// Simulated Responses (Demo Mode)
// ===================================
function simulateResponse(automationId, data) {
    const timestamp = new Date().toISOString();

    switch (automationId) {
        case 'email-manager':
            const isUrgent = (data.subject || '').toLowerCase().includes('urgent');
            return {
                success: true,
                category: isUrgent ? 'URGENT' : 'NORMAL',
                priority: isUrgent ? 'high' : 'normal',
                email: {
                    from: data.from,
                    subject: data.subject
                },
                action: isUrgent ? 'Alert generated' : 'Processed normally',
                timestamp
            };

        case 'invoice-generator':
            const montant = parseFloat(data.montantHT) || 0;
            return {
                success: true,
                invoiceNumber: `SA-2025-${Date.now().toString().slice(-6)}`,
                date: new Date().toISOString().split('T')[0],
                client: {
                    name: data.clientName,
                    email: data.clientEmail
                },
                amounts: {
                    ht: `${montant.toFixed(2)} MAD`,
                    tva: `${(montant * 0.20).toFixed(2)} MAD`,
                    ttc: `${(montant * 1.20).toFixed(2)} MAD`
                },
                message: 'Facture generee avec succes',
                timestamp
            };

        case 'expense-tracker':
            const expenseAmount = parseFloat(data.amount) || 0;
            return {
                success: true,
                message: 'Depense enregistree avec succes',
                expense: {
                    id: `EXP-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    amount: `${expenseAmount.toFixed(2)} MAD`,
                    category: data.category || 'Autres',
                    merchant: data.merchant || 'Non specifie'
                },
                monthly_summary: {
                    total_spent: `${(expenseAmount + 230).toFixed(2)} MAD`,
                    transactions: 4,
                    top_categories: [
                        `Restaurant: 180.00 MAD`,
                        `${data.category || 'Autres'}: ${expenseAmount.toFixed(2)} MAD`
                    ]
                },
                timestamp
            };

        case 'social-publisher':
            return {
                success: true,
                message: 'Contenu genere pour LinkedIn et Instagram',
                original: data.content,
                platforms: {
                    linkedin: {
                        content: `💡 Insight du jour :\n\n${data.content}\n\n✅ Qu'en pensez-vous?\n\n#Leadership #Business #Innovation #Maroc`,
                        optimal_time: '09:00-11:00 (mardi-jeudi)',
                        status: 'ready'
                    },
                    instagram: {
                        content: `✨ ${data.content}\n\n💭 Et vous, vous en pensez quoi?\n\n#Maroc 🇲🇦 #Entrepreneur #Motivation #Success`,
                        optimal_time: '19:00-21:00 (tous les jours)',
                        status: 'ready'
                    }
                },
                tips: [
                    '💡 LinkedIn : Publiez en semaine entre 9h-11h',
                    '📸 Instagram : Ajoutez une image accrocheuse'
                ],
                timestamp
            };

        case 'news-digest':
            return {
                success: true,
                digest_title: `📰 Digest ${data.keyword} - ${new Date().toLocaleDateString('fr-FR')}`,
                search_keyword: data.keyword,
                total_articles: data.max_articles || 5,
                articles: [
                    {
                        title: `${data.keyword}: Les dernieres avancees au Maroc`,
                        source: 'Medias24',
                        published: new Date(Date.now() - 3600000).toISOString(),
                        summary: `Le secteur de ${data.keyword} connait une croissance remarquable...`,
                        relevance_score: 9.2,
                        sentiment: 'Positif'
                    },
                    {
                        title: `Innovation dans ${data.keyword}: Le Maroc en pointe`,
                        source: 'LesEco.ma',
                        published: new Date(Date.now() - 7200000).toISOString(),
                        summary: 'Les entreprises marocaines adoptent de nouvelles technologies...',
                        relevance_score: 8.7,
                        sentiment: 'Positif'
                    }
                ],
                insights: {
                    trending_topics: ['Innovation', 'Digital', 'PME'],
                    overall_sentiment: 'Positif'
                },
                timestamp
            };

        case 'meeting-reminder':
            return {
                success: true,
                message: 'Rappels configures avec succes',
                meeting: {
                    id: `EVT-${Date.now()}`,
                    title: data.title,
                    start_time: data.start_time,
                    location: data.location || 'A definir',
                    type: data.meeting_type || 'standard'
                },
                reminders: [
                    {
                        timing: '24h before',
                        message: `📅 Rappel: ${data.title} demain`,
                        channel: 'WhatsApp + Email'
                    },
                    {
                        timing: '2h before',
                        message: `⏰ ${data.title} dans 2 heures`,
                        channel: 'WhatsApp'
                    }
                ],
                travel: data.location ? {
                    estimated_time: '20-30 min',
                    maps_link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location)}`
                } : null,
                timestamp
            };

        case 'doc-summarizer':
            const wordCount = data.content?.split(/\s+/).length || 0;
            return {
                success: true,
                message: 'Document analyse avec succes',
                document: {
                    id: `DOC-${Date.now()}`,
                    title: data.title || 'Document sans titre',
                    type: data.document_type || 'general'
                },
                metadata: {
                    word_count: wordCount,
                    reading_time: `${Math.ceil(wordCount / 200)} min`
                },
                analysis: {
                    executive_summary: (data.content || '').substring(0, 200) + '...',
                    key_points: [
                        'Point cle 1 identifie dans le document',
                        'Point cle 2 extrait automatiquement',
                        'Conclusion principale du document'
                    ],
                    keywords: ['rapport', 'analyse', 'croissance', 'resultat'],
                    recommended_actions: [
                        'Lire le document complet',
                        'Identifier les points de suivi',
                        'Partager avec les parties prenantes'
                    ]
                },
                timestamp
            };

        case 'career-builder':
            return {
                success: true,
                message: 'CV et lettre de motivation generes avec succes',
                application: {
                    id: `APP-${Date.now()}`,
                    candidate: data.full_name,
                    position: data.target_position
                },
                documents: {
                    cv: {
                        title: `CV_${(data.full_name || '').replace(/\s+/g, '_')}.html`,
                        format: 'HTML',
                        sections: ['Profil', 'Experience', 'Formation', 'Competences', 'Langues']
                    },
                    cover_letter: {
                        title: `Lettre_Motivation_${(data.full_name || '').replace(/\s+/g, '_')}.html`,
                        format: 'HTML'
                    }
                },
                next_steps: [
                    '📄 Telecharger les documents HTML',
                    '🖨️ Convertir en PDF si necessaire',
                    ' Envoyer votre candidature'
                ],
                timestamp
            };

        case 'order-manager':
            const items = data.items || [];
            const subtotal = items.reduce((sum, item) =>
                sum + ((item.quantity || 0) * (item.unit_price || 0)), 0);
            const tax = subtotal * 0.20;
            const shipping = data.shipping_cost || 30;
            return {
                success: true,
                message: 'Commande enregistree avec succes',
                order: {
                    id: `CMD-2025-${Date.now().toString().slice(-8)}`,
                    status: 'pending',
                    tracking_url: `https://smartautomate.ma/track/CMD-2025-${Date.now().toString().slice(-8)}`
                },
                customer: {
                    name: data.customer_name,
                    email: data.customer_email
                },
                pricing: {
                    subtotal: `${subtotal.toFixed(2)} MAD`,
                    tax: `${tax.toFixed(2)} MAD`,
                    shipping: `${shipping.toFixed(2)} MAD`,
                    total: `${(subtotal + tax + shipping).toFixed(2)} MAD`
                },
                estimated_delivery: {
                    days: '3-5 jours ouvrables'
                },
                notifications: {
                    customer_email_sent: true,
                    vendor_notified: true
                },
                timestamp
            };

        case 'chatbot':
            return [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": "DÉMO: " + generateChatResponse(data.message),
                        "refusal": null,
                        "annotations": []
                    },
                    "logprobs": null,
                    "finish_reason": "stop"
                }
            ];

        default:
            return { success: true, message: 'Operation effectuee', timestamp };
    }
}

// ===================================
// Chatbot Functions
// ===================================
function detectIntent(message) {
    if (!message) return 'general';
    const lowerMessage = message.toLowerCase();

    if (/^(bonjour|salut|hello|hi)/i.test(lowerMessage)) return 'greeting';
    if (/(aide|aider|comment|besoin)/i.test(lowerMessage)) return 'help';
    if (/(automatise|automation|workflow)/i.test(lowerMessage)) return 'automation';
    if (/(prix|tarif|cout)/i.test(lowerMessage)) return 'pricing';
    if (/(merci|thank)/i.test(lowerMessage)) return 'thanks';
    if (/(au revoir|bye)/i.test(lowerMessage)) return 'goodbye';

    return 'general';
}

function generateChatResponse(message) {
    const intent = detectIntent(message);

    const responses = {
        greeting: 'Bonjour! 👋 Je suis Smart Assistant, votre assistant virtuel. Comment puis-je vous aider aujourd\'hui?',
        help: 'Je suis la pour vous aider! 🤝 Je peux vous renseigner sur:\n• Nos 10 automatisations\n• Les tarifs\n• Les fonctionnalites\n\nQue souhaitez-vous savoir?',
        automation: 'Smart Automate propose 10 workflows intelligents:\n\n Email Manager\n💰 Invoice Generator\n💸 Expense Tracker\n Social Publisher\n📰 News Digest\n📅 Meeting Reminder\n📄 Doc Summarizer\n📝 Career Builder\n📦 Order Manager\n💬 Chatbot\n\nLequel vous interesse?',
        pricing: 'Nos offres commencent a partir de 49 MAD/mois! 💰\n\n• Starter: 49 MAD/mois\n• Professional: 199 MAD/mois\n• Enterprise: 599 MAD/mois\n\nChaque plan inclut un support et des fonctionnalites adaptees.',
        thanks: 'Avec plaisir! 😊 N\'hesitez pas si vous avez d\'autres questions.',
        goodbye: 'Au revoir et a bientot! 👋 L\'equipe Smart Automate reste a votre disposition.',
        general: 'Merci pour votre message! Je suis Smart Assistant. Je peux vous aider avec des informations sur nos automatisations, tarifs, ou fonctionnalites. Que souhaitez-vous savoir?'
    };

    return responses[intent] || responses.general;
}

async function submitChatMessage(event) {
    event.preventDefault();

    const form = event.target;
    const input = form.querySelector('input[name="message"]');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to chat
    addChatMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing';
    typingDiv.innerHTML = `
        <div class="chat-avatar"><i class="fas fa-robot"></i></div>
        <div class="chat-content">
            <span class="animate-pulse">En train d'ecrire...</span>
        </div>
    `;
    elements.chatContainer.appendChild(typingDiv);
    scrollChatToBottom();

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Remove typing indicator
    typingDiv.remove();

    // Get and display bot response
    try {
        const response = await callAPI('chatbot', { message });
        console.log('Chatbot API Response:', response);

        let botText = '';

        // 1. Try if response is a simple string
        if (typeof response === 'string') {
            botText = response;
        }
        // 2. Try the Array format (n8n node / OpenAI direct)
        else if (Array.isArray(response) && response.length > 0) {
            // Priority: .content (user's specific format) -> .message.content -> .text
            botText = response[0].content || response[0].message?.content || response[0].text || JSON.stringify(response[0]);
        }
        // 3. Try common object properties
        else if (response) {
            botText = response.content || response.output || response.text || response.message || (response.bot && response.bot.message) || JSON.stringify(response);
        }

        // Final fallback if botText is still empty
        if (!botText) {
            botText = generateChatResponse(message);
        }

        // Simple Markdown-to-HTML Formatter
        const formattedText = botText
            .replace(/### (.*)/g, '<h4 style="margin: 10px 0 5px; color: var(--primary-blue);">$1</h4>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/```([\s\S]*?)```/g, '<pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; margin: 10px 0; font-size: 0.85rem; border-left: 3px solid var(--primary-cyan);"><code>$1</code></pre>')
            .replace(/^- (.*)/gm, '<div style="margin-left: 10px; margin-bottom: 5px;"><i class="fas fa-chevron-right" style="font-size: 0.7rem; color: var(--primary-cyan); margin-right: 5px;"></i> $1</div>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');

        addChatMessage(formattedText, 'bot', true); // Use true for HTML content
    } catch (error) {
        console.error('Chat error:', error);
        addChatMessage("Désolé, j'ai rencontré une erreur technique en communiquant avec le workflow. Vérifiez que votre webhook n8n est actif.", 'bot');
    }
}

function addChatMessage(text, sender, isHTML = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;

    const icon = sender === 'bot' ? 'fas fa-robot' : 'fas fa-user';
    const content = isHTML ? text : text.replace(/\n/g, '<br>');

    messageDiv.innerHTML = `
        <div class="chat-avatar"><i class="${icon}"></i></div>
        <div class="chat-content">${content}</div>
    `;

    elements.chatContainer.appendChild(messageDiv);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    if (elements.chatContainer) {
        elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
    }
}

// ===================================
// Toast Notifications
// ===================================
function showToast(message, type = 'success') {
    const toast = elements.toast;
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon i');

    // Set message and type
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;

    // Update icon
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
    } else {
        toastIcon.className = 'fas fa-exclamation-circle';
    }

    // Show toast
    toast.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// Smooth Scroll
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .service-card, .automation-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    animationObserver.observe(el);
});

// ===================================
// Contact Form Handler
// ===================================
document.getElementById('contact-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simulate form submission
    showToast('Message envoye avec succes! Nous vous contacterons bientot.', 'success');
    this.reset();
});

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('SmartAutomate Frontend Initialized');

    // Set default datetime for meeting reminder
    const dateInput = document.querySelector('input[name="start_time"]');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(14, 0, 0, 0);
        dateInput.value = tomorrow.toISOString().slice(0, 16);
    }
});

// Make functions available globally
window.openModal = openModal;
window.closeModal = closeModal;
window.submitForm = submitForm;
window.submitChatMessage = submitChatMessage;
// ===============================
// PDF Generation (Friend Enhanced)
// ===============================
async function generatePDFWithJsPDF(response) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error('jsPDF library not loaded');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Palette Zellij-Themed (Blue/Cyan/Orange)
    const primaryColor = [3, 3, 87];      // Blue
    const secondaryColor = [52, 176, 204]; // Cyan
    const accentColor = [238, 130, 32];    // Orange
    const lightBg = [245, 245, 245];
    const textGray = [102, 102, 102];
    const borderGray = [204, 204, 204];
    const white = [255, 255, 255];

    const pageWidth = 210;
    const pageHeight = 297;
    const marginX = 20;
    const marginTop = 25;
    const contentWidth = pageWidth - marginX * 2;

    let y = marginTop;
    const data = response.formData || {};

    // Header Structure
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 55, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(white[0], white[1], white[2]);
    doc.text((data.full_name || "NOM COMPLET").toUpperCase(), pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.text(data.profile_title || "Professionnel", pageWidth / 2, 30, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(` ${data.email || ''} |  ${data.phone || ''}`, pageWidth / 2, 38, { align: 'center' });
    doc.text(` ${data.address || 'Maroc'}`, pageWidth / 2, 44, { align: 'center' });

    // Social Links
    doc.setFontSize(8);
    let socialStr = "";
    if (data.linkedin) socialStr += `LinkedIn: ${data.linkedin}   `;
    if (data.portfolio) socialStr += `Portfolio: ${data.portfolio}`;
    doc.text(socialStr, pageWidth / 2, 50, { align: 'center' });

    y = 70;

    // Profil Professionnel
    addPDFSectionTitle(doc, 'PROFIL PROFESSIONNEL', marginX, y, primaryColor, secondaryColor);
    y += 12;
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.rect(marginX, y - 2, contentWidth, 22, 'F');
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(marginX, y - 2, 2, 22, 'F');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const profileLines = doc.splitTextToSize(data.profile_summary || "Motivé et passionné par l'innovation.", contentWidth - 10);
    doc.text(profileLines, marginX + 5, y + 4);
    y += Math.max(profileLines.length * 5, 25) + 5;

    // Experience
    addPDFSectionTitle(doc, 'EXPÉRIENCE PROFESSIONNELLE', marginX, y, primaryColor, secondaryColor);
    y += 12;
    const experiences = data.experiences || [];
    experiences.forEach(exp => {
        addPDFExperienceItem(doc, exp.position, exp.company, exp.period, exp.description, marginX, y, primaryColor, secondaryColor, borderGray, textGray);
        y += 30;
    });

    // Education
    addPDFSectionTitle(doc, 'FORMATION', marginX, y, primaryColor, secondaryColor);
    y += 12;
    const education = data.education?.[0] || { degree: 'Diplôme', institution: 'Université', year: '2023', details: '' };
    addPDFEducationItem(doc, education.degree, education.institution || education.school || 'Établissement', education.year, education.details, marginX, y, primaryColor, secondaryColor, borderGray, textGray);
    y += 25;

    // Skills
    addPDFSectionTitle(doc, 'COMPÉTENCES', marginX, y, primaryColor, secondaryColor);
    y += 12;
    const skills = data.technical_skills || [];
    let skillX = marginX + 5;
    doc.setFontSize(9);
    skills.forEach(skill => {
        const tw = doc.getTextWidth(skill) + 10;
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.roundedRect(skillX, y - 4, tw, 7, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(skill, skillX + 5, y + 1);
        skillX += tw + 5;
        if (skillX > pageWidth - marginX) { skillX = marginX + 5; y += 10; }
    });

    y += 15;

    // Motivation (New Section)
    if (data.why_company || data.why_position) {
        if (y > pageHeight - 50) { doc.addPage(); y = 30; }
        addPDFSectionTitle(doc, 'MOTIVATION & OBJECTIFS', marginX, y, primaryColor, secondaryColor);
        y += 12;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

        if (data.why_company) {
            doc.text("Pourquoi votre entreprise :", marginX, y);
            y += 5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            const whyLines = doc.splitTextToSize(data.why_company, contentWidth);
            doc.text(whyLines, marginX, y);
            y += whyLines.length * 5 + 5;
        }

        if (data.why_position) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("Pourquoi ce poste :", marginX, y);
            y += 5;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            const posLines = doc.splitTextToSize(data.why_position, contentWidth);
            doc.text(posLines, marginX, y);
            y += posLines.length * 5 + 5;
        }
    }

    // Footer
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.line(marginX, pageHeight - 20, pageWidth - marginX, pageHeight - 20);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Généré par SmartAutomate • ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save(`CV_${(data.full_name || 'Candidat').replace(/\s+/g, '_')}.pdf`);
}

function addPDFSectionTitle(doc, title, x, y, primaryColor, secondaryColor) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(title, x, y);
    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(1.5);
    doc.line(x, y + 2, x + 40, y + 2);
}

function addPDFExperienceItem(doc, pos, comp, period, desc, x, y, primary, secondary, border, gray) {
    doc.setDrawColor(border[0], border[1], border[2]);
    doc.line(x + 5, y - 2, x + 5, y + 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primary[0], primary[1], primary[2]);
    doc.text(pos, x + 10, y + 2);
    doc.setFontSize(10);
    doc.setTextColor(secondary[0], secondary[1], secondary[2]);
    doc.text(`${comp} | ${period}`, x + 10, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const lines = doc.splitTextToSize(desc, 160);
    doc.text(lines, x + 10, y + 14);
}

function addPDFEducationItem(doc, deg, inst, year, details, x, y, primary, secondary, border, gray) {
    doc.setDrawColor(border[0], border[1], border[2]);
    doc.line(x + 5, y - 2, x + 5, y + 15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primary[0], primary[1], primary[2]);
    doc.text(deg, x + 10, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(secondary[0], secondary[1], secondary[2]);
    doc.text(`${inst} | ${year}`, x + 10, y + 8);

    if (details) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(details, x + 10, y + 13);
    }
}
