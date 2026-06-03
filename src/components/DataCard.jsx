import React from 'react'

function DataCard({ title, description, badges = [], meta = [], href, secondaryHref, ctaLabel = 'فتح', actions = [], onAction }) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
      <div className="bg-gradient-to-r from-islamic-primary to-islamic-light px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-white font-bold text-lg leading-snug">{title}</h3>
          {badges[0] ? (
            <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-white text-xs font-semibold">
              {badges[0]}
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {description ? (
          <p className="text-slate-700 text-sm leading-7 text-right whitespace-pre-wrap">{description}</p>
        ) : null}

        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-end">
            {badges.slice(1).map((badge) => (
              <span key={badge} className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold">
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        {meta.length > 0 ? (
          <div className="space-y-2 text-right text-xs text-slate-500">
            {meta.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        ) : null}

        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-end pt-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => onAction?.(action.id)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  action.variant === 'secondary'
                    ? 'bg-blue-50 text-islamic-primary hover:bg-blue-100'
                    : 'bg-islamic-primary text-white hover:bg-islamic-light'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}

        {(href || secondaryHref) ? (
          <div className="flex flex-wrap gap-3 justify-end pt-2">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-islamic-primary px-4 py-2 text-sm font-semibold text-white hover:bg-islamic-light transition-colors"
              >
                {ctaLabel}
              </a>
            ) : null}
            {secondaryHref ? (
              <a
                href={secondaryHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-islamic-primary hover:bg-blue-50 transition-colors"
              >
                المزيد
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default DataCard
