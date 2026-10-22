"""Render avatar CEPIRIT sebagai SVG standalone dari konfigurasi.

Geometri sama persis dengan komponen CepiritAvatar di frontend
(viewBox 96x96) supaya hasil render konsisten di dua sisi.
Dipakai endpoint GET /api/avatar/render — berguna untuk preview,
gambar profil statis, atau dibagikan sebagai file .svg.
"""

STYLE = """
.sway { transform-origin: 48px 56px; animation: sway 3.2s ease-in-out infinite; }
.look { animation: look 5s ease-in-out infinite; }
.work { transform-origin: 48px 86px; animation: bounce .55s ease-in-out infinite; }
.work .look { animation-duration: 1.1s; }
.blink { transform-origin: 48px 58px; animation: blink 4.4s infinite; }
.spark { transform-origin: center; animation: spark 0.9s ease-in-out infinite; }
.spark2 { animation-delay: 0.45s; }
@keyframes sway { 0%,100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
@keyframes look { 0%,100% { transform: translateX(0); } 25% { transform: translateX(1.6px); } 75% { transform: translateX(-1.6px); } }
@keyframes bounce { 0%,100% { transform: translateY(0) scale(1,1); } 30% { transform: translateY(-7px) scale(.97,1.03); } 55% { transform: translateY(0) scale(1.05,.94); } 75% { transform: translateY(-3px) scale(.99,1.01); } }
@keyframes blink { 0%,92%,100% { transform: scaleY(1); } 95% { transform: scaleY(.08); } }
@keyframes spark { 0%,100% { opacity: .15; transform: scale(.7); } 50% { opacity: 1; transform: scale(1.15); } }
"""

HATS = {
    "toga": """
      <g transform="rotate(-8 48 27)">
        <polygon points="48,14 80,27 48,40 16,27" fill="#6a5cff"/>
        <polygon points="48,14 80,27 48,40 16,27" fill="none" stroke="#8f88ff" stroke-width="1.5" opacity="0.6"/>
        <rect x="40" y="32" width="16" height="9" rx="2" fill="#6a5cff"/>
        <line x1="78" y1="27" x2="78" y2="44" stroke="#ffd166" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="78" cy="47" r="3.5" fill="#ffd166"/>
      </g>""",
    "topi": """
      <g transform="rotate(-8 48 27)">
        <path d="M25 33 Q48 13 71 33 Z" fill="#3b82f6"/>
        <path d="M60 29 Q86 27 89 35 Q75 39 60 35 Z" fill="#2563eb"/>
        <circle cx="48" cy="19" r="3" fill="#2563eb"/>
      </g>""",
    "mahkota": """
      <g transform="rotate(-8 48 27)">
        <polygon points="28,36 28,20 38,28 48,16 58,28 68,20 68,36" fill="#ffd166" stroke="#e0a800" stroke-width="1.5"/>
        <circle cx="48" cy="27" r="2.6" fill="#ff5a5a"/>
      </g>""",
    "none": "",
}

GLASSES = """
      <g stroke="#2b2b2b" stroke-width="2.2" fill="none" stroke-linecap="round">
        <circle cx="38" cy="58" r="10"/>
        <circle cx="58" cy="58" r="10"/>
        <line x1="28" y1="55" x2="20" y2="49"/>
        <line x1="68" y1="55" x2="76" y2="49"/>
      </g>"""

SPARKS = """
      <polygon class="spark" points="14,26 16,32 22,34 16,36 14,42 12,36 6,34 12,32" fill="#ffd166"/>
      <polygon class="spark spark2" points="82,52 83.5,57 88.5,58.5 83.5,60 82,65 80.5,60 75.5,58.5 80.5,57" fill="#ffd166"/>"""


def render_avatar_svg(body: str = "#ff9046", hat: str = "toga",
                      accessory: str = "none", state: str = "idle") -> str:
    """state: "idle" (goyang pelan) atau "working" (lompat-lompat saat progress)."""
    working = state == "working"
    group_class = "work" if working else "sway"
    sparks = SPARKS if working else ""
    hat_svg = HATS.get(hat, HATS["toga"])
    glasses = GLASSES if accessory == "kacamata" else ""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <style>{STYLE}</style>
  <ellipse cx="48" cy="88" rx="24" ry="4" fill="#000" opacity="0.25"/>
  <g class="{group_class}">
    <circle cx="48" cy="56" r="30" fill="{body}"/>
    <ellipse cx="40" cy="46" rx="10" ry="6" fill="#fff" opacity="0.35"/>
    {hat_svg}
    <g class="blink">
      <circle cx="38" cy="58" r="7" fill="#fff"/>
      <circle cx="58" cy="58" r="7" fill="#fff"/>
      <g class="look">
        <circle cx="38" cy="58" r="3.5" fill="#2b2b2b"/>
        <circle cx="58" cy="58" r="3.5" fill="#2b2b2b"/>
        <circle cx="39.2" cy="56.8" r="1.1" fill="#fff"/>
        <circle cx="59.2" cy="56.8" r="1.1" fill="#fff"/>
      </g>
    </g>
    {glasses}
    <circle cx="29" cy="68" r="4" fill="#ff8fa3" opacity="0.65"/>
    <circle cx="67" cy="68" r="4" fill="#ff8fa3" opacity="0.65"/>
    <path d="M38 73 Q48 82 58 73" stroke="#4a2410" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  </g>
  {sparks}
</svg>"""
