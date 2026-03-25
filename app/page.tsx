import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 네비 */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="text-lg font-light tracking-wider text-gray-900">청첩장</span>
        <div className="flex items-center gap-5">
          <Link href="/my" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            내 청첩장
          </Link>
          <Link href="/create" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            만들기
          </Link>
        </div>
      </nav>

      {/* 히어로 */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-6">Mobile Wedding Invitation</p>
        <h1 className="text-4xl sm:text-5xl font-light text-gray-900 leading-tight mb-6">
          세상에 하나뿐인<br />
          <span className="italic">나만의 청첩장</span>
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-md mx-auto">
          정보를 입력하고, 마음에 드는 템플릿을 고르고,
          색상과 폰트를 내 취향으로 바꿔보세요.
          완성된 청첩장은 링크 하나로 공유됩니다.
        </p>
        <Link
          href="/create"
          className="inline-block px-10 py-4 bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          무료로 만들기 →
        </Link>
      </section>

      {/* 특징 */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-gray-100">
        <div className="grid sm:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-3xl mb-4">✏️</div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">자유로운 커스터마이징</h3>
            <p className="text-xs text-gray-400 leading-relaxed">색상, 폰트, 섹션을 원하는 대로 수정할 수 있어요</p>
          </div>
          <div>
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">모바일 최적화</h3>
            <p className="text-xs text-gray-400 leading-relaxed">카카오톡으로 공유하면 바로 예쁘게 보여요</p>
          </div>
          <div>
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">링크로 간편 공유</h3>
            <p className="text-xs text-gray-400 leading-relaxed">QR코드와 공유 링크로 하객에게 전달하세요</p>
          </div>
        </div>
      </section>

      {/* 템플릿 미리보기 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-4">Templates</p>
          <h2 className="text-2xl font-light text-gray-900 mb-10">4가지 감성 템플릿</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { name: '미니멀 화이트', bg: '#ffffff', color: '#1a1a1a', icon: '◻' },
              { name: '소프트 블러쉬', bg: '#fdf6f8', color: '#8b4a6b', icon: '🌸' },
              { name: '딥 포레스트', bg: '#f5f9f7', color: '#2d4a3e', icon: '🌿' },
              { name: '골든 엘레강스', bg: '#fdfbf5', color: '#b8860b', icon: '✦' },
            ].map(t => (
              <div key={t.name} className="text-center">
                <div
                  className="aspect-[2/3] border flex items-center justify-center mb-2 text-2xl shadow-sm"
                  style={{ backgroundColor: t.bg, borderColor: t.color }}
                >
                  {t.icon}
                </div>
                <p className="text-xs text-gray-500">{t.name}</p>
              </div>
            ))}
          </div>
          <Link href="/create" className="inline-block mt-10 px-8 py-3 border border-gray-300 text-sm text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors">
            지금 시작하기
          </Link>
        </div>
      </section>

      <footer className="text-center py-8 text-xs text-gray-300">
        © 2025 청첩장
      </footer>
    </main>
  )
}
