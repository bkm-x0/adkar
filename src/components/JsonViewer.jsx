import React, { useState } from 'react'

function JsonNode({ data, name }) {
  const [open, setOpen] = useState(false)

  const isObject = data && typeof data === 'object' && !Array.isArray(data)
  const isArray = Array.isArray(data)

  if (!isObject && !isArray) {
    return (
      <div className="text-xs text-slate-200">
        {name ? <span className="text-white/80">{name}: </span> : null}
        <span>{String(data)}</span>
      </div>
    )
  }

  const entries = isArray ? data : Object.entries(data)

  return (
    <div className="text-xs text-slate-200 pl-2">
      <button onClick={() => setOpen((v) => !v)} className="text-sm text-white/80 mb-1">
        {open ? '▼' : '▶'} {name || (isArray ? `Array(${data.length})` : `Object(${Object.keys(data).length})`)}
      </button>

      {open ? (
        <div className="pl-3 space-y-1">
          {isArray
            ? data.map((item, i) => <JsonNode key={i} name={`${i}`} data={item} />)
            : Object.entries(data).map(([k, v]) => <JsonNode key={k} name={k} data={v} />)}
        </div>
      ) : null}
    </div>
  )
}

export default function JsonViewer({ data }) {
  if (data === null || data === undefined) return <div className="text-slate-400">لا توجد بيانات</div>

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      return <JsonNode data={parsed} />
    } catch {
      return <pre className="text-xs text-slate-200">{data}</pre>
    }
  }

  return <JsonNode data={data} />
}
