import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowUp, Instagram } from 'lucide-react';
import './styles.css';

const A = '/assets/';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function useReveal(routeKey) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal], [data-title-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [routeKey]);
}

function useHashRoute() {
  const [hash, setHash] = useState(() => {
    const initialHash = window.location.hash || '#top';
    const shouldKeepWorksHash = window.sessionStorage.getItem('scrollToWorksAfterDetail') === 'true';

    if (initialHash === '#works' && !shouldKeepWorksHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#top`);
      window.scrollTo(0, 0);
      return '#top';
    }

    return initialHash;
  });

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#top');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return hash;
}

function CustomCursor() {
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf = 0;
    let activeTarget = null;

    const chipSelector = '.header-nav a, .work-detail-back';
    const iconChipSelector = '.page-top';
    const morphSelector = `${chipSelector}, ${iconChipSelector}`;

    const updateTarget = (element) => {
      activeTarget = element instanceof Element ? element.closest(morphSelector) : null;
      cursor.classList.toggle('is-active', Boolean(activeTarget));
      cursor.classList.toggle('is-chip', Boolean(activeTarget?.closest(chipSelector)));
      cursor.classList.toggle('is-icon-chip', Boolean(activeTarget?.closest(iconChipSelector)));
    };

    const render = () => {
      const chipTarget = activeTarget?.closest(chipSelector);
      const iconTarget = activeTarget?.closest(iconChipSelector);
      const morphTarget = chipTarget || iconTarget;

      if (morphTarget) {
        const rect = morphTarget.getBoundingClientRect();
        cursor.style.left = `${rect.left + rect.width / 2}px`;
        cursor.style.top = `${rect.top + rect.height / 2}px`;
        cursor.style.setProperty('--cursor-width', `${Math.round(rect.width)}px`);
        cursor.style.setProperty('--cursor-height', `${Math.round(rect.height)}px`);
      } else {
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        cursor.style.removeProperty('--cursor-width');
        cursor.style.removeProperty('--cursor-height');
      }

      raf = 0;
    };

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      updateTarget(event.target);
      cursor.classList.remove('is-hidden');
      if (!raf) raf = requestAnimationFrame(render);
    };

    const syncFromPoint = () => {
      updateTarget(document.elementFromPoint(x, y));
      cursor.classList.remove('is-hidden');
      if (!raf) raf = requestAnimationFrame(render);
    };

    const leave = () => {
      activeTarget = null;
      cursor.classList.add('is-hidden');
      cursor.classList.remove('is-active', 'is-chip', 'is-icon-chip');
      cursor.style.removeProperty('--cursor-width');
      cursor.style.removeProperty('--cursor-height');
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseover', syncFromPoint);
    document.addEventListener('mouseout', syncFromPoint);
    document.addEventListener('mouseleave', leave);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', syncFromPoint);
      document.removeEventListener('mouseout', syncFromPoint);
      document.removeEventListener('mouseleave', leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="custom-cursor is-hidden" aria-hidden="true" />;
}

const nav = [
  { label: '顶部', href: '#top' },
  { label: '简介', href: '#top_profile' },
  { label: '经历', href: '#service' },
  { label: '作品', href: '#works' },
  { label: '优势', href: '#advantages' },
  { label: '联系', href: '#contact' },
];

const services = [
  {
    id: '01',
    period: '2025.04~至今',
    title: '中软国际',
    paragraphs: [
      '负责北京移动、江苏电信等运营商数字化项目设计，覆盖移动端 App、智能问数平台、指标管理平台等产品，推进需求分析、交互视觉设计、开发协同及上线验收。',
      '结合 Codex、Claude Code、Figma Make 搭建 AI 辅助设计工作流，将设计规范沉淀为 Markdown 文档并封装为可复用 Skill，供产品与研发团队调用，提升方案验证与设计交付效率。',
    ],
    tags: ['运营商项目', 'AI设计工作流', '设计资产沉淀'],
    image: 'top_service_img3.jpg',
    logo: 'service-cssoft.png',
  },
  {
    id: '02',
    period: '2021.09~2024.11',
    title: '星环科技',
    paragraphs: [
      '独立负责南京“金融风控”、上海“量化投研”、成都“政府军工”三条业务线的产品设计，覆盖需求梳理、信息架构、交互视觉设计及开发验收，推动复杂 ToB 项目完整落地。',
      '配合公司上市及战略方向调整，参与存量产品设计体系重构，完成设计规范梳理与组件库建设，统一多条产品线的设计语言和交付标准，提升产品体验一致性与研发协作效率。',
    ],
    tags: ['跨部门沟通', '设计体系重构', '组件库搭建'],
    image: 'top_service_img4.jpg',
    logo: 'service-transwarp.png',
  },
  {
    id: '03',
    period: '2020.07~2021.07',
    title: '智器云科技',
    paragraphs: [
      '负责“火眼金睛”智能稽查平台、大数据可视化情报分析平台等政务安全类产品的版本迭代，围绕风险研判和情报分析场景完成核心流程及关键页面设计。',
      '深入公安局等客户现场开展需求调研、方案评审与项目验收，协同产品和研发推动设计落地；同时承担运营视觉物料设计，支撑产品对外传播。',
    ],
    tags: ['政企数字化', '多版本迭代', '数据可视化'],
    image: 'service-wordpress-desk.png',
    logo: 'service-zhiqiyun.png',
  },
];

const works = [
  { slug: 'corporate-site', image: 'senzu.jpg', title: '企业官网设计', description: '为企业品牌制作官方网站，强化品牌形象与业务可信度。', tags: ['策划', '网页设计', '前端开发', 'WordPress'] },
  { slug: 'education-landing', image: 'tokuyobi.jpg', title: '教育服务落地页', description: '为教育服务制作营销型落地页，突出核心卖点与转化路径。', tags: ['策划', '网页设计', '前端开发', 'WordPress'] },
  { slug: 'design-company', image: 'kma.jpg', title: '设计公司官网', description: '为设计公司制作企业官网，呈现专业服务与品牌调性。', tags: ['策划', '网页设计', '前端开发', 'WordPress'] },
  { slug: 'saas-landing', image: 'smartlcloud.jpg', title: 'SaaS 产品落地页', description: '为云服务产品制作介绍页面，清晰表达产品价值。', tags: ['策划', '网页设计', '前端开发'] },
  { slug: 'manufacturing-site', image: 'moridenki.jpg', title: '制造企业官网', description: '为制造企业制作官方网站，整理服务信息与企业实力展示。', tags: ['策划', '网页设计', '前端开发', 'WordPress'] },
  { slug: 'portfolio-site', image: 'shisa.jpg', title: '个人作品集网站', description: '为个人创作者制作作品集网站，突出视觉表达与履历信息。', tags: ['策划', '网页设计', '前端开发', 'WordPress'] },
  { slug: 'pet-clinic-site', image: 'rururu.jpg', title: '宠物医院官网', description: '为宠物医院更新官网，优化信息层级与预约咨询入口。', tags: ['策划', '网页设计', '前端开发', 'WordPress'] },
  { slug: 'brand-site', image: 'ultrajam.jpg', title: '品牌企业官网', description: '为品牌企业制作官方网站，统一视觉语言与内容呈现。', tags: ['策划', '网页设计', '前端开发'] },
  { slug: 'photo-studio', image: 'blanc.jpg', title: '摄影工作室网站', description: '使用 Figma 完成摄影工作室网站视觉设计。', tags: ['网页设计'] },
  { slug: 'hair-salon', image: 'hair-salon_site.jpg', title: '美发沙龙网站', description: '为美发沙龙制作网页设计方案，突出空间氛围与预约转化。', tags: ['网页设计'] },
];

const featuredWorks = works.slice(0, 6).map((work) => ({
  ...work,
  year: '2026',
  role: 'UI/UX设计',
}));

const impactCards = [
  {
    id: '01',
    label: '经验',
    title: '企业级平台设计',
    text: '具备企业级平台从零到一设计经验，擅长复杂业务梳理与体系搭建',
    color: '#D7FF41',
    tone: 'orange',
  },
  {
    id: '02',
    label: '工具',
    title: 'AI工作流落地',
    text: '持续探索AI与设计业务融合，推动智能工具在实际项目中落地',
    color: '#111111',
    tone: 'black',
  },
  {
    id: '03',
    label: '沟通',
    title: '跨部门沟通协同',
    text: '能够准确理解多方诉求，降低沟通成本并提升团队交付效率',
    color: '#a8c6ff',
    tone: 'blue',
  },
];

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header ${open ? 'open' : ''}`}>
      <a className="header-logo text-logo" href="#top">LeiLei Densign</a>
      <nav className={`header-nav ${open ? 'open' : ''}`}>
        {nav.map((item) => <a key={item.label} onClick={() => setOpen(false)} href={item.href}>{item.label}</a>)}
      </nav>
      <button className={`burger ${open ? 'cross' : ''}`} onClick={() => setOpen(!open)} aria-label="菜单">
        <span /><span /><span />
      </button>
    </header>
  );
}

function Button({ children, white = false }) {
  return <a className={`btn ${white ? 'btn-white' : ''}`} href="#contact">{children}</a>;
}

function Hero() {
  return (
    <section className="hero section-gap" id="top">
      <div className="hero-inner">
        <figure className="hero-image"><img src={`${A}mv_img.jpg`} alt="" /></figure>
        <img className="skill-circle" src={`${A}skill_circle.png`} alt="" />
        <div className="hero-copy">
          <h1 className="hero-statement">
            <span>以设计定义方向</span>
            <span>让 AI 加速抵达</span>
          </h1>
          <div className="hero-text">
            <p className="lead-ja">我专注于 UI / UX 与 AI 产品设计，擅长在用户体验、业务需求与技术能力之间建立连接。通过清晰的设计语言，将抽象概念转化为可理解、可操作、可落地的产品体验。</p>
            <p className="lead-en">我将 AI 视为设计工作流中的协作者，用它辅助洞察、发散、生成与迭代。设计师负责提出正确的问题，而 AI 帮助我们更快看见更多可能。</p>
            <Button>查看联系方式</Button>
          </div>
        </div>
        <span className="scroll-label">向下滚动</span>
      </div>
    </section>
  );
}

function Service() {
  return (
    <section className="service section-gap" id="service">
      <div className="inner">
        <h2 className="section-title title-reveal" data-title-reveal><span>经历</span></h2>
        <div className="service-list">
          {services.map((s, i) => (
            <article className={`service-row ${i % 2 ? 'reverse' : ''}`} data-reveal key={s.id}>
              <figure>
                <span className="service-image-frame">
                  <img className="service-img-default" src={`${A}${s.image}`} alt="" />
                  <img className="service-img-logo" src={`${A}${s.logo}`} alt="" />
                </span>
              </figure>
              <div className="service-body">
                <p className="service-period">{s.period}</p>
                <h3>{s.title}</h3>
                <div className="service-copy">
                  {s.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <div className="service-tags">
                  {s.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <a className="arrow-link" href="#">查看详情</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Works() {
  return (
    <section className="works" id="works">
      <div className="inner works-inner">
        <h2 className="section-title dark title-reveal" data-title-reveal><span>作品</span></h2>
        <div className="work-grid">
          {featuredWorks.map((w) => (
            <article className="work-card" data-reveal key={w.slug}>
              <a className="work-card-image" href={`#/works/${w.slug}`} aria-label={`查看${w.title}详情`}>
                <figure><img src={`${A}${w.image}`} alt="" /><span>查看详情</span></figure>
              </a>
              <div className="work-body">
                <div className="tags">{w.tags.map((t) => <b key={t}>{t}</b>)}</div>
                <h3>{w.title}</h3>
                <p>{w.description}</p>
                <a className="arrow-link" href={`#/works/${w.slug}`}>查看详情</a>
              </div>
            </article>
          ))}
        </div>
        <p className="works-note">部分开发案例因保密协议无法公开展示，如需了解更多项目经验，可在咨询时进一步沟通。</p>
      </div>
    </section>
  );
}

function WorkDetail({ work }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [work.slug]);

  const backToWorks = (event) => {
    event.preventDefault();
    window.sessionStorage.setItem('scrollToWorksAfterDetail', 'true');
    window.location.hash = '#works';
  };

  const otherWorks = featuredWorks.filter((item) => item.slug !== work.slug);

  return (
    <main className="work-detail-page">
      <section className="work-detail-hero">
        <div className="work-detail-inner">
          <a className="work-detail-back" href="#works" onClick={backToWorks} aria-label="返回主页作品模块">
            <ArrowLeft size={22} strokeWidth={2.1} aria-hidden="true" />
            <span>返回主页</span>
          </a>

          <div className="work-detail-heading" data-reveal>
            <p>Works Detail</p>
            <h1 className="title-reveal" data-title-reveal><span>{work.title}</span></h1>
            <dl className="work-detail-meta">
              <div>
                <dt>年份</dt>
                <dd>{work.year}</dd>
              </div>
              <div>
                <dt>身份</dt>
                <dd>{work.role}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="work-detail-main">
        <div className="work-detail-inner">
          <figure className="work-detail-visual" data-reveal>
            <img src={`${A}${work.image}`} alt={work.title} />
          </figure>
        </div>
      </section>

      <section className="other-works">
        <div className="work-detail-inner">
          <div className="other-works-heading" data-reveal>
            <p>Other Designs</p>
            <h2>其他设计</h2>
          </div>
          <div className="other-work-grid" data-reveal>
            <div className="other-work-track">
              {[...otherWorks, ...otherWorks].map((item, index) => (
                <a className="other-work-card" href={`#/works/${item.slug}`} key={`${item.slug}-${index}`}>
                  <figure><img src={`${A}${item.image}`} alt="" /><span>查看详情</span></figure>
                  <div>
                    <small>{item.year} / {item.role}</small>
                    <h3>{item.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ContactFooter showCta={false} showFooter={false} />
    </main>
  );
}

function ImpactSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="impact-section" id="advantages" data-reveal>
      <div className="impact-inner">
        <div className="impact-heading">
          <h2 className="section-title title-reveal" data-title-reveal><span>优势</span></h2>
          <p>悬浮卡片查看</p>
        </div>

        <div className="impact-cards" aria-label="Impact cards">
          {impactCards.map((card, index) => {
            const isActive = active === index;
            return (
              <article
                className={`impact-card impact-card--${card.tone} ${isActive ? 'is-active' : ''}`}
                key={card.id}
                style={{ '--impact-color': card.color }}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
              >
                <button
                  className="impact-toggle"
                  type="button"
                  aria-label={`打开 ${card.label}`}
                  aria-expanded={isActive}
                  onClick={(event) => {
                    event.stopPropagation();
                    setActive(index);
                  }}
                >
                  <span />
                  <span />
                </button>
                <div className="impact-card-label">{card.id} / {card.label}</div>
                <div className={`impact-visual impact-visual--${card.tone}`} aria-hidden="true">
                  {card.tone === 'orange' && (
                    <div className="impact-target">
                      <i />
                      <b />
                    </div>
                  )}
                  {card.tone === 'black' && (
                    <div className="impact-orbit">
                      <i />
                      <i />
                      <i />
                      <b />
                    </div>
                  )}
                  {card.tone === 'blue' && (
                    <div className="impact-identity-mark">
                      <i />
                      <i />
                      <i />
                      <b />
                    </div>
                  )}
                </div>
                <div className="impact-card-content">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
                <div className="impact-vertical">{card.label}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Profile() {
  return (
    <section className="profile section-gap" id="top_profile">
      <div className="inner">
        <h2 className="section-title title-reveal" data-title-reveal><span>简介</span></h2>
        <div className="profile-content">
          <div className="profile-visual" data-reveal>
            <img className="profile-bg" src={`${A}profile_bg.jpg`} alt="" />
            <img className="profile-photo" src={`${A}profile_new.jpg`} alt="" />
          </div>
          <div className="profile-copy" data-reveal>
            <img className="leilei-name" src={`${A}leilei-logo.svg`} alt="leilei" />
            <h3>网页设计师</h3>
            <dl><dt>- 关于我</dt><dd>曾在大型企业积累多年项目经验，之后以网页设计师身份独立开展工作。现在主要为中小企业、个人品牌与创业团队提供网站设计、页面制作和品牌视觉落地服务。</dd></dl>
            <dl><dt>- 专业能力</dt><dd>网站策划与信息架构<br />网页视觉设计 / 前端实现 / WordPress 搭建</dd></dl>
            <div className="sns"><Instagram size={34} /><span>X</span></div>
            <Button>联系方式</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactFooter({ showCta = true, showFooter = true }) {
  return (
    <>
      {showCta && (
        <aside className="contact-cta" id="contact" data-reveal>
          <div className="inner"><div className="contact-panel"><h2 className="title-reveal" data-title-reveal><span>联系</span></h2><p>如需网站制作、页面设计或项目咨询，欢迎与我联系。</p><Button>立即联系</Button></div></div>
        </aside>
      )}
      <a className="page-top" href="#top" aria-label="返回顶部">
        <ArrowUp size={24} strokeWidth={2.2} aria-hidden="true" />
      </a>
      {showFooter && (
        <footer>
          <a className="footer-logo text-logo" href="#top">LeiLei Design</a>
          <nav>{nav.map((n) => <a key={n.label} href={n.href}>{n.label}</a>)}</nav>
          <small>©2026 LeiLei Design.</small>
        </footer>
      )}
    </>
  );
}

function App() {
  const hash = useHashRoute();
  const detailSlug = hash.match(/^#\/works\/([^/]+)$/)?.[1];
  const activeWork = featuredWorks.find((work) => work.slug === detailSlug);
  useReveal(hash);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activeWork || !hash || hash.startsWith('#/')) return undefined;
    if (hash !== '#works' || window.sessionStorage.getItem('scrollToWorksAfterDetail') !== 'true') return undefined;

    window.sessionStorage.removeItem('scrollToWorksAfterDetail');

    const scrollToHash = () => {
      const target = document.querySelector('#works');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const timers = [80, 900, 1800].map((delay) => window.setTimeout(scrollToHash, delay));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeWork, hash]);

  return (
    <div className="wrapper">
      <CustomCursor />
      <div className="loading"><span>l</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span><span>.</span><span>.</span><span>.</span></div>
      <div className="opening" />
      <div className="opening opening-2" />
      <Header />
      {activeWork ? (
        <WorkDetail work={activeWork} />
      ) : (
        <main>
          <Hero />
          <Profile />
          <Service />
          <Works />
          <ImpactSection />
          <ContactFooter />
        </main>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
