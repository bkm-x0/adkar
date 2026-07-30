import React from 'react'
import { X } from 'lucide-react'
import JsonViewer from './JsonViewer'

function DetailModal({ detail, onClose }) {
  if (!detail) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl border border-white/10">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold">{detail.title}</h2>
            {detail.subtitle ? <p className="text-sm text-white/70 mt-1">{detail.subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
          <div className="max-h-[75vh] overflow-auto p-6">
            <JsonViewer data={detail.data} />
          </div>

          <div className="border-t lg:border-t-0 lg:border-l border-white/10 bg-white/5 p-6 space-y-4 max-h-[75vh] overflow-auto">
            <div className="space-y-2 text-sm">
              {detail.meta?.map((item) => (
                <p key={item} className="text-white/80">{item}</p>
              ))}
            </div>
            {detail.links?.length ? (
              <div className="space-y-3">
                {detail.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl bg-white/10 px-4 py-3 text-sm text-white hover:bg-white/15 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailModal
