'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        // Redirect to admin dashboard on success
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('A network error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0e0b05' }}>
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-10" style={{ background: '#1a1209', border: '1px solid rgba(201,137,29,0.2)' }}>
          <div className="text-center mb-10">
            <h1 className="text-3xl text-white mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Admin Access
            </h1>
            <p className="text-white/40 text-sm" style={{ fontFamily: 'var(--font-jost)' }}>
              Please enter your master credentials to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-jost)' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,137,29,0.6)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-jost)' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,137,29,0.6)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-400 text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'var(--font-jost)' }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 text-[#1a1209] font-semibold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #e8bf5e 0%, #c9891d 100%)', fontFamily: 'var(--font-jost)', letterSpacing: '0.16em' }}
            >
              {loading ? 'Authenticating...' : 'Login to Dashboard →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
