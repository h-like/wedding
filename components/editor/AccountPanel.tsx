'use client'

import { AccountInfo } from '@/types/invitation'

interface AccountPanelProps {
  groomAccount: AccountInfo | null
  brideAccount: AccountInfo | null
  onGroomChange: (account: AccountInfo | null) => void
  onBrideChange: (account: AccountInfo | null) => void
}

export default function AccountPanel({ groomAccount, brideAccount, onGroomChange, onBrideChange }: AccountPanelProps) {
  return (
    <section>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">계좌번호</h3>
      <div className="space-y-4">
        <AccountFields
          label="신랑측"
          account={groomAccount}
          onChange={onGroomChange}
        />
        <AccountFields
          label="신부측"
          account={brideAccount}
          onChange={onBrideChange}
        />
      </div>
    </section>
  )
}

function AccountFields({
  label,
  account,
  onChange,
}: {
  label: string
  account: AccountInfo | null
  onChange: (account: AccountInfo | null) => void
}) {
  const val = account ?? { bank: '', name: '', number: '' }

  const set = (key: keyof AccountInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...val, [key]: e.target.value }
    // 모두 비어있으면 null로 저장
    const isEmpty = !next.bank && !next.name && !next.number
    onChange(isEmpty ? null : next)
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-1.5">{label}</p>
      <div className="space-y-1.5">
        <input
          type="text"
          value={val.bank}
          onChange={set('bank')}
          placeholder="은행명 (예: 신한은행)"
          className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-gray-400"
        />
        <input
          type="text"
          value={val.number}
          onChange={set('number')}
          placeholder="계좌번호"
          className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-gray-400"
        />
        <input
          type="text"
          value={val.name}
          onChange={set('name')}
          placeholder="예금주"
          className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-gray-400"
        />
      </div>
    </div>
  )
}
