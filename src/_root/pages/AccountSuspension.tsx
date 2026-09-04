import mtukutu from '../../../public/assetss/icons/photo-change.png'
import tea from '../../../public/assetss/icons/tag.png'
import marada from '../../../public/assetss/icons/draft.png'
import aura from '../../../public/assetss/icons/auraa.png'

const AccountSuspension = () => {
  return (
    <div className="con-to">
      <div className=" meme-re">
        {/* Top */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-cyan-400 flex items-center justify-center wavy-circle-sm">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-white" />
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            </div>

            <div>
              <h2 className="text-white font-semibold text-lg">
                ishow.weed
              </h2>
              <p className="text-gray-300 text-sm">Memelord</p>
            </div>
          </div>

          <div className='find'>
          <button className='someone'>
              <img
                src={aura}
                alt='A'
                className='auraa'
              />
          </button>
          <div className="text-white text-2xl leading-none her">
            <span className='me'>
            </span>
          </div>
          
          </div>
        </div>

        {/* Input */}
        <div className="mt-8 border-b border-white/10 pb-4">
          <input
            type="text"
            placeholder="What’s on your mind?"
            className="w-full bg-transparent text-white placeholder:text-gray-400 outline-none text-lg"
          />
        </div>

        {/* Bottom */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-5 text-white text-xl">
            <div className='dreams'>
              <img 
                src={mtukutu}
                alt="ADD"
                className='post-photo'
              />
            </div>

            <div className='dreams'>
              <img 
                src={tea}
                alt="TAG"
                className='post-photo'
              />
            </div>

            <div className='dreams'>
              <img 
                src={marada}
                alt="DRAFTS"
                className='post-photo'
              />
            </div>
            

          </div>

          <button className="publisher">
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountSuspension