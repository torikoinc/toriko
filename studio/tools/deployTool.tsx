import {useEffect, useState} from 'react'
import {definePlugin} from 'sanity'

// Bouton 「サイトを更新」 : déclenche un build Netlify via un build hook.
// URL du hook dans studio/.env → SANITY_STUDIO_NETLIFY_BUILD_HOOK=https://api.netlify.com/build_hooks/xxx
const HOOK = process.env.SANITY_STUDIO_NETLIFY_BUILD_HOOK
const COOLDOWN = 3 * 60 * 1000 // 3 min entre deux clics
const KEY = 'toriko-last-deploy'

function DeployTool() {
  const [last, setLast] = useState<number>(() => Number(localStorage.getItem(KEY)) || 0)
  const [now, setNow] = useState(Date.now())
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const wait = Math.max(0, last + COOLDOWN - now)
  const disabled = !HOOK || state === 'sending' || wait > 0

  const deploy = async () => {
    setState('sending')
    try {
      // no-cors : Netlify ne renvoie pas d'en-têtes CORS, mais la requête part bien
      await fetch(HOOK!, {method: 'POST', mode: 'no-cors'})
      const t = Date.now()
      localStorage.setItem(KEY, String(t))
      setLast(t)
      setState('sent')
    } catch {
      setState('error')
    }
  }

  const fmt = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`

  return (
    <div style={{maxWidth: 520, margin: '80px auto', padding: 24, fontFamily: 'inherit', lineHeight: 1.7}}>
      <h1 style={{fontSize: 22, margin: '0 0 16px'}}>サイトを更新</h1>
      <p style={{margin: '0 0 8px'}}>
        すべての変更を「公開」したあと、このボタンを押してください。
        <br />約2分でウェブサイトに反映されます。
      </p>
      <p style={{margin: '0 0 24px', fontSize: 13, opacity: 0.7}}>
        ※「公開」しただけではサイトは更新されません。まとめて1回押せばOKです。
      </p>

      <button
        onClick={deploy}
        disabled={disabled}
        style={{
          padding: '14px 28px', fontSize: 16, fontWeight: 600, border: 0, borderRadius: 6,
          background: disabled ? '#999' : '#1a1a1a', color: '#fff', cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {state === 'sending' ? '送信中…' : 'サイトを更新する'}
      </button>

      <p style={{marginTop: 20, fontSize: 14}}>
        {!HOOK && '⚠️ 設定エラー：ビルドフックが未設定です（管理者に連絡してください）'}
        {state === 'sent' && '✓ 更新を開始しました。2分ほどでサイトに反映されます。'}
        {state === 'error' && '✗ エラーが発生しました。もう一度お試しください。'}
        {state !== 'sent' && wait > 0 && `次の更新まで ${fmt(wait)}`}
      </p>
      {last > 0 && (
        <p style={{fontSize: 12, opacity: 0.6}}>最終更新：{new Date(last).toLocaleString('ja-JP')}</p>
      )}
    </div>
  )
}

export const deployTool = definePlugin({
  name: 'toriko-deploy',
  tools: [{name: 'deploy', title: 'サイトを更新', component: DeployTool}],
})
