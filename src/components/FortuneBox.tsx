export function FortuneBox() {
  return (
    <svg className="fortune-box-art" viewBox="0 0 420 490" fill="none" aria-hidden="true">
      <defs>
        <filter id="box-shadow" x="-60%" y="-100%" width="220%" height="300%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <pattern id="wood-grain" width="47" height="160" patternUnits="userSpaceOnUse">
          <path d="M8-20C-9 29 24 64 9 180M27-20C45 22 11 74 29 180M38-20C20 36 53 88 40 180" stroke="#53291d" strokeWidth=".7" opacity=".17" />
          <path d="M15-20C32 34 1 92 18 180" stroke="#f9d5ad" strokeWidth=".7" opacity=".2" />
        </pattern>
      </defs>
      <ellipse cx="222" cy="446" rx="104" ry="14" fill="#513b27" opacity=".18" filter="url(#box-shadow)" />
      <g transform="rotate(-9 210 260)">
        {/* Three solid lacquered wood faces; no lighting gradients. */}
        <path d="m94 117 38 41 5 258-37-43z" fill="#c5684c" />
        <path d="m132 158 100 23 8 257-103-22z" fill="#b94b35" />
        <path d="m232 181 82-31v250l-74 38z" fill="#923b2b" />
        <path d="m94 117 38 41 100 23 82-31v250l-74 38-103-22-37-43z" fill="url(#wood-grain)" />
        <path d="m94 117 38 41 100 23 82-31" stroke="#e29871" strokeWidth="2" />
        <path d="m132 159 5 256m95-233 8 255" stroke="#5d271c" strokeOpacity=".3" />
        <path d="m99 361 38 41 103 23 74-37v12l-74 38-103-22-37-43z" fill="#7f3326" />
        <path d="m99 361 38 41 103 23 74-37" stroke="#e49d75" strokeOpacity=".65" strokeWidth="1.2" />
        <path d="m97 142 37 40 99 23 81-32m-216-23 36 39 99 23 81-32" stroke="#e9b88e" strokeOpacity=".7" strokeWidth="1.4" />
        <path d="m102 341 35 39 102 23 75-37m-212-18 35 39 102 23 75-37" stroke="#e9b88e" strokeOpacity=".7" strokeWidth="1.4" />
        <path d="m94 117 79-29 99 23 42 39-82 31-100-23z" fill="#cc6e50" />
        <path d="m104 118 70-24 94 22 35 32-72 27-95-23z" stroke="#e8a982" strokeWidth="1.3" />
        <path d="m112 119 63-20 90 21 29 26-64 24-90-22z" stroke="#9b432e" strokeWidth=".8" />
        <path d="m150 111 101 22m-85-27 101 23m-129-11 101 23m-90-15 101 23" stroke="#91422e" strokeOpacity=".2" />
        <ellipse cx="205" cy="132" rx="18" ry="6" transform="rotate(13 205 132)" fill="#692e23" />
        <path d="m188 128 33 8" stroke="#4f291e" strokeWidth="2.5" strokeLinecap="round" />
        {/* A paper label set into the front facet. */}
        <path d="m153 218 59 14 5 126-61-14z" fill="#f1e4c9" />
        <path d="m158 225 49 12 4 113-51-11z" stroke="#a7503b" strokeWidth=".8" />
        <g fill="#77372c" fontFamily="'Shippori Mincho', serif" fontSize="27" textAnchor="middle" transform="matrix(1 .23 .025 1 0 -40)">
          <text x="179" y="261">御</text>
          <text x="179" y="295">神</text>
          <text x="179" y="329">籤</text>
        </g>
        <path d="m261 237 24-11m-23 18 24-11m-22 73 23-11m-22 18 23-11" stroke="#d59b75" strokeOpacity=".6" strokeWidth="1.2" />
        <path d="m267 263 14-7 1 21-14 7z" stroke="#d59b75" strokeOpacity=".65" />
        {/* Hand-tied cotton cord around the body. */}
        <path d="m99 174 36 37 99 23 80-29" stroke="#713c2d" strokeOpacity=".2" strokeWidth="5" />
        <path d="m99 171 36 37 99 23 80-29" stroke="#e7c99d" strokeWidth="3" />
        <path d="M240 231c-18-25-30-14-13-3 4 3 9 4 13 3Zm0 0c18-30 30-21 17-8-5 5-10 7-17 8Z" stroke="#efd6ac" strokeWidth="2.8" />
        <path d="M240 230c-8 19-10 31-7 46m8-46c9 13 15 28 14 38" stroke="#efd6ac" strokeWidth="2.5" />
        <path d="m230 273 6 1m17-9 6 1" stroke="#d7b489" strokeWidth="5" />
      </g>
    </svg>
  )
}
