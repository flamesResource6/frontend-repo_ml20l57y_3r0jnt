import { useEffect, useMemo, useState } from 'react'

function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
      {children}
    </span>
  )
}

export default function App() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [experience, setExperience] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [contact, setContact] = useState({ name: '', email: '', subject: '', body: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const [p, pr, ex, sk] = await Promise.all([
          fetch(`${baseUrl}/api/profile`).then(r => r.json()),
          fetch(`${baseUrl}/api/projects`).then(r => r.json()),
          fetch(`${baseUrl}/api/experience`).then(r => r.json()),
          fetch(`${baseUrl}/api/skills`).then(r => r.json()),
        ])
        if (!mounted) return
        setProfile(p)
        setProjects(Array.isArray(pr) ? pr : [])
        setExperience(Array.isArray(ex) ? ex : [])
        setSkills(Array.isArray(sk) ? sk : [])
      } catch (e) {
        setError('Gagal memuat data. Coba lagi nanti.')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [baseUrl])

  const submitContact = async (e) => {
    e.preventDefault()
    setContactError('')
    setSent(false)
    if (!contact.name || !contact.email || !contact.subject || !contact.body) {
      setContactError('Mohon lengkapi semua kolom.')
      return
    }
    try {
      setSending(true)
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      })
      if (!res.ok) throw new Error('Gagal mengirim pesan')
      setSent(true)
      setContact({ name: '', email: '', subject: '', body: '' })
    } catch (e) {
      setContactError('Terjadi kesalahan saat mengirim. Coba lagi.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-gray-900">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="#home" className="text-xl font-extrabold tracking-tight">{profile?.name || 'Portofolio'}</a>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#projects" className="hover:text-blue-600 transition-colors">Projek</a>
            <a href="#experience" className="hover:text-blue-600 transition-colors">Pengalaman</a>
            <a href="#skills" className="hover:text-blue-600 transition-colors">Keahlian</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Kontak</a>
          </nav>
          <a href="#contact" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Hubungi Saya</a>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200 via-indigo-200 to-purple-200" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="mb-4 flex items-center gap-2">
              <Badge>Terbuka untuk peluang</Badge>
              <Badge>{profile?.location || 'Indonesia'}</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {profile?.name || 'Nama Anda'}
            </h1>
            <p className="mt-2 text-xl md:text-2xl text-blue-700 font-semibold">{profile?.title || 'Software Developer'}</p>
            <p className="mt-6 text-gray-700 max-w-2xl">{profile?.bio || 'Saya membangun aplikasi web modern yang cepat dan elegan.'}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {profile?.socials?.github && (
                <a className="px-4 py-2 rounded-md ring-1 ring-slate-300 hover:bg-slate-50" href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a>
              )}
              {profile?.socials?.linkedin && (
                <a className="px-4 py-2 rounded-md ring-1 ring-slate-300 hover:bg-slate-50" href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              )}
              {profile?.email && (
                <a className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" href={`mailto:${profile.email}`}>Email</a>
              )}
            </div>
          </div>
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-200 to-indigo-200 blur-lg" />
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1200&auto=format&fit=crop'}
                alt="Foto Profil"
                className="relative rounded-2xl w-64 h-64 object-cover shadow-2xl ring-1 ring-slate-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Projek Pilihan" subtitle="Beberapa karya terbaik yang pernah saya kerjakan" />
          {loading ? (
            <p className="text-center text-gray-600">Memuat projek...</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-gray-600">Belum ada projek ditampilkan. Tambahkan data melalui database untuk menampilkan projek Anda.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <article key={p._id} className="group rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {p.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Array.isArray(p.tags) && p.tags.slice(0,4).map((t,i) => (
                        <Badge key={i}>{t}</Badge>
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-3">{p.description}</p>
                    <div className="mt-4 flex items-center gap-3">
                      {p.demo_url && <a className="text-blue-600 hover:text-blue-700 font-medium" href={p.demo_url} target="_blank" rel="noreferrer">Demo</a>}
                      {p.repo_url && <a className="text-slate-600 hover:text-slate-800 font-medium" href={p.repo_url} target="_blank" rel="noreferrer">Kode</a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="py-16 md:py-24 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Pengalaman" subtitle="Perjalanan karier dan pendidikan" />
          {loading ? (
            <p className="text-center text-gray-600">Memuat pengalaman...</p>
          ) : experience.length === 0 ? (
            <p className="text-center text-gray-600">Belum ada data pengalaman.</p>
          ) : (
            <ol className="relative border-s-2 border-slate-200">
              {experience.map((e, idx) => (
                <li key={e._id || idx} className="ms-6 mb-8">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">{idx+1}</span>
                  <h4 className="text-lg font-semibold">{e.role} • <span className="text-blue-700">{e.company}</span></h4>
                  <p className="text-sm text-gray-600">{e.start} — {e.end}</p>
                  {e.summary && <p className="mt-2 text-gray-700">{e.summary}</p>}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Keahlian" subtitle="Teknologi yang saya gunakan sehari-hari" />
          {loading ? (
            <p className="text-center text-gray-600">Memuat keahlian...</p>
          ) : skills.length === 0 ? (
            <p className="text-center text-gray-600">Belum ada data keahlian.</p>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {skills.map((s, i) => (
                <Badge key={s._id || i}>{s.name}{s.level ? ` • ${s.level}%` : ''}</Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Kontak" subtitle="Ada pertanyaan, proyek, atau kolaborasi? Kirim pesan!" />
          <form onSubmit={submitContact} className="grid grid-cols-1 gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama"
                className="w-full rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                value={contact.name}
                onChange={e => setContact({ ...contact, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                value={contact.email}
                onChange={e => setContact({ ...contact, email: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Subjek"
              className="w-full rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              value={contact.subject}
              onChange={e => setContact({ ...contact, subject: e.target.value })}
            />
            <textarea
              rows={5}
              placeholder="Tulis pesan Anda..."
              className="w-full rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              value={contact.body}
              onChange={e => setContact({ ...contact, body: e.target.value })}
            />
            {contactError && <p className="text-sm text-red-600">{contactError}</p>}
            {sent && <p className="text-sm text-green-600">Terima kasih! Pesan Anda sudah terkirim.</p>}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
              >
                {sending ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
              {error && <span className="text-sm text-red-600">{error}</span>}
            </div>
          </form>
          <p className="mt-6 text-center text-xs text-slate-500">Backend: {baseUrl}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">© {new Date().getFullYear()} {profile?.name || 'Nama Anda'}. Semua hak cipta dilindungi.</p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#projects" className="hover:text-blue-600">Projek</a>
            <a href="#experience" className="hover:text-blue-600">Pengalaman</a>
            <a href="#skills" className="hover:text-blue-600">Keahlian</a>
            <a href="#contact" className="hover:text-blue-600">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
