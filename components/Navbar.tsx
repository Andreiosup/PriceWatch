import Image from 'next/image'
import Link from 'next/link'

const navIcons = [
  { src: '/assets/icons/search.svg', alt: 'search' , link:"https://www.amazon.com/?&linkCode=ll2&tag=operapc-def-sp-sd-ro-21&linkId=38f7f08f6d064ad541aa6a543b3e1f4b&ref_=as_li_ss_tl"},
  { src: '/assets/icons/user.svg', alt: 'user', link:"https://github.com/Andreiosup" },
]

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="nav ">
        <Link href="/" className="flex items-center gap-1">
          <p className="nav-logo">
            Price<span className='text-emerald-400'>Watch</span>
          </p>
        </Link>

        <div className="flex items-center gap-4">
          {navIcons.map((item) => (
            <div className='hover:bg-emerald-400 p-1 rounded-xl' key={item.alt}>
              <Link href={String(item.link)}>
                <Image 
             
                  src={item.src}
                  alt={item.alt}
                  width={28}
                  height={28}
                  className="object-contain"
                  
                />
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar