/**
 * Yash Chaudhari - Portfolio Interactive Engine
 * Modular, vanilla JavaScript for theme toggle, modals, filtering, and accessibility.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIconSun && themeIconMoon) {
      if (theme === 'dark') {
        themeIconSun.style.display = 'block';
        themeIconMoon.style.display = 'none';
      } else {
        themeIconSun.style.display = 'none';
        themeIconMoon.style.display = 'block';
      }
    }
  };

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Listen to system changes if user hasn't explicitly set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Drawer & Overlay
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', closeDrawer);
    }

    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        closeDrawer();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Scrollspy & Header Active Link
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const onScrollSpy = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 120;
      const sectionId = sec.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScrollSpy, { passive: true });

  // --------------------------------------------------------------------------
  // 4. Project Category Filtering
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = card.classList.contains('featured-hero') ? 'grid' : 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 5. Project Detail Modal Data & Handler (Verified from GitHub Audit)
  // --------------------------------------------------------------------------
  const projectDetails = {
    placementx: {
      title: "PlacementX: Smart Campus Placement Automation",
      category: "Full-Stack Monorepo · NMIMS University Capstone",
      image: "assets/images/project-placementx.png",
      summary: "PlacementX is an intelligent campus recruitment automation and decision support platform engineered for NMIMS University. It replaces disjointed spreadsheets with a unified system featuring automated resume ATS analysis, smart candidate shortlisting, skill gap analysis, and placement drive tracking.",
      contributions: "Architected full-stack TypeScript monorepo with React 18 frontend (Vite, Tailwind CSS v4, shadcn/ui) and Express/Prisma/PostgreSQL 16 backend. Integrated Redis and BullMQ job queues for asynchronous resume parsing, Supabase encrypted storage for student records, and Firebase Cloud Messaging for instant notifications. Also built companion Android native app (CapstoneX).",
      tech: ["React 18", "TypeScript", "Vite", "Tailwind CSS v4", "Express", "Prisma ORM", "PostgreSQL 16", "Redis", "BullMQ", "Supabase", "Firebase"],
      github: "https://github.com/YashChaudhari999/PlacementX",
      demo: null
    },
    samsung: {
      title: "Samsung Screen Recorder",
      category: "Android & Systems · Native Mobile Open-Source",
      image: "assets/images/project-samsung.jpg",
      summary: "A native, open-source Android screen recorder inspired by Samsung One UI aesthetics. Provides clean, non-intrusive full-screen and partial-screen recording, internal audio capturing, microphone mixing, and floating overlay controls without ads or telemetry.",
      contributions: "Engineered core Android screen recording pipeline utilizing Android MediaProjection API, MediaCodec, MediaMuxer, foreground services, custom One UI-style floating overlays, and localized video storage management with zero external SDK bloat. Published signed APK release v1.0.0.",
      tech: ["Java", "Android SDK", "MediaProjection API", "MediaCodec", "MediaMuxer", "Foreground Services", "One UI Design"],
      github: "https://github.com/YashChaudhari999/samsung-screen-recorder",
      demo: "https://github.com/YashChaudhari999/samsung-screen-recorder/releases/latest"
    },
    forgefield: {
      title: "Forgefield: AI Creative Project Studio",
      category: "AI & Modern Web · Next.js 14 App Router",
      image: "assets/images/project-forgefield.png",
      summary: "A high-performance AI creative workspace designed for prompt engineers and digital creators to structure cinematic video briefs, organize reference media, and orchestrate generation pipelines. Built for the 8x Engineering benchmark with live production deployment.",
      contributions: "Engineered complete Next.js 14 App Router application with TypeScript, Tailwind CSS, Lucide React, and Framer Motion. Implemented modular studio layout with prompt configuration canvas, aspect ratio and model pickers, simulated multi-stage generation state machine, and cloud persistence with Supabase PostgreSQL and Realtime subscriptions.",
      tech: ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Framer Motion", "Vercel"],
      github: "https://github.com/YashChaudhari999/Clone-Higgsfield-AI",
      demo: "https://clone-higgsfield-ai.vercel.app"
    },
    hospital: {
      title: "Distributed Hospital Management System",
      category: "Distributed Systems · Java Socket Server & MongoDB",
      image: "assets/images/project-hospital.png",
      summary: "A multi-client distributed healthcare management system built with Java 21, Swing UI, custom multithreaded TCP socket server architecture, and MongoDB. Eliminates HTTP REST overhead by ~50% across local clinic workstations for instant admission, diagnosis updating, and medical record synchronization.",
      contributions: "Designed low-level TCP socket protocol using ServerSocket and multithreaded ClientHandler runnable workers with connection pools. Structured MongoDB document database schemas for patient timelines and diagnostic histories. Authored comprehensive architectural sequence diagram.",
      tech: ["Java 21", "Socket Programming", "Multithreading", "MongoDB 5.1", "Maven", "Java Swing"],
      github: "https://github.com/YashChaudhari999/Hospital-Management-System-Java-MongoDB",
      demo: null
    },
    autointegrate: {
      title: "Library-Integration-Assistant",
      category: "Developer Tools · AI Code Assistant",
      image: "assets/images/project-syncdub.svg",
      summary: "An AI-powered developer tool that analyzes NPM packages via LLM prompt engineering, generates context-aware integration code, and produces copy-pasteable snippets that fit seamlessly into existing codebases without breaking architectural structure.",
      contributions: "Built React/Vite developer tool with Tailwind CSS and OpenRouter Gemma API integration. Engineered structured prompt templates in .bolt to parse package APIs and generate clean integration wrappers with automated error-handling patterns.",
      tech: ["React", "Vite", "JavaScript", "Tailwind CSS", "OpenRouter API", "Gemma LLM", "Prompt Engineering"],
      github: "https://github.com/YashChaudhari999/auto-integrate",
      demo: null
    },
    espeakup: {
      title: "eSpeakUp: Language Learning & Interactive Chatbot",
      category: "Full-Stack Web · Diploma Final Year Major Project",
      image: "assets/images/project-2.webp",
      summary: "An interactive web-based language learning platform developed as a Diploma Final Year Major Project by a 5-member student engineering team (with Yash as lead full-stack contributor). Features vocabulary exercises, quizzes, student progress tracking, and an interactive conversational chatbot.",
      contributions: "Led full-stack architecture using PHP, MySQL, and JavaScript. Designed relational database schemas for student scoring and session history, and built interactive client-side quiz workflows.",
      tech: ["PHP", "MySQL", "JavaScript", "HTML5", "CSS3"],
      github: "https://github.com/YashChaudhari999/EspeakUp",
      demo: null
    }
  };

  const projectModal = document.getElementById('projectModal');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalCat = document.getElementById('projectModalCat');
  const projectModalImg = document.getElementById('projectModalImg');
  const projectModalSummary = document.getElementById('projectModalSummary');
  const projectModalContrib = document.getElementById('projectModalContrib');
  const projectModalTech = document.getElementById('projectModalTech');
  const projectModalGithub = document.getElementById('projectModalGithub');
  const projectModalDemo = document.getElementById('projectModalDemo');

  const openProjectModal = (key) => {
    const data = projectDetails[key];
    if (!data) return;

    projectModalTitle.textContent = data.title;
    projectModalCat.textContent = data.category;
    projectModalImg.src = data.image;
    projectModalImg.alt = data.title;
    projectModalSummary.textContent = data.summary;
    projectModalContrib.textContent = data.contributions;

    // Tech pills
    projectModalTech.innerHTML = '';
    data.tech.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-pill';
      span.textContent = t;
      projectModalTech.appendChild(span);
    });

    // Links
    projectModalGithub.href = data.github;
    if (data.demo) {
      projectModalDemo.href = data.demo;
      projectModalDemo.style.display = 'inline-flex';
    } else {
      projectModalDemo.style.display = 'none';
    }

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('[data-project-key]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-project-key');
      openProjectModal(key);
    });
  });

  // --------------------------------------------------------------------------
  // 6. Research Evidence Modal & Zoom
  // --------------------------------------------------------------------------
  const evidenceModal = document.getElementById('evidenceModal');
  const evidenceModalImg = document.getElementById('evidenceModalImg');
  const evidenceModalTitle = document.getElementById('evidenceModalTitle');
  const evidenceModalPlatform = document.getElementById('evidenceModalPlatform');
  const evidenceModalYear = document.getElementById('evidenceModalYear');
  const evidenceModalType = document.getElementById('evidenceModalType');
  const evidenceModalDesc = document.getElementById('evidenceModalDesc');

  document.querySelectorAll('[data-evidence-card]').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-evidence-title');
      const platform = card.getAttribute('data-evidence-platform');
      const year = card.getAttribute('data-evidence-year');
      const type = card.getAttribute('data-evidence-type');
      const desc = card.getAttribute('data-evidence-desc');
      const imgSrc = card.getAttribute('data-evidence-img');

      evidenceModalTitle.textContent = title;
      evidenceModalPlatform.textContent = platform;
      evidenceModalYear.textContent = year;
      evidenceModalType.textContent = type;
      evidenceModalDesc.textContent = desc;
      evidenceModalImg.src = imgSrc;
      evidenceModalImg.alt = `${platform} - ${title}`;

      evidenceModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Modal Closers
  const closeAllModals = () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // --------------------------------------------------------------------------
  // 7. One-Click Email Copy
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyEmailFeedback = document.getElementById('copyEmailFeedback');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'yashchaudhari500@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        if (copyEmailFeedback) {
          copyEmailFeedback.textContent = 'Copied! ✓';
          setTimeout(() => {
            copyEmailFeedback.textContent = 'Copy ⎘';
          }, 2500);
        }
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. Contact Form Client-side Handler
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent = 'Please fill out all fields.';
          formStatus.className = 'form-status active';
          formStatus.style.color = '#e11d48';
        }
        return;
      }

      // Open user's email client directly with prefilled parameters
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Yash,\n\n${message}\n\nFrom: ${name} (${email})`);
      window.location.href = `mailto:yashchaudhari500@gmail.com?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.textContent = 'Opening your email client... Thank you!';
        formStatus.className = 'form-status active success';
      }
      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 9. Back to Top Smooth Scroll
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});