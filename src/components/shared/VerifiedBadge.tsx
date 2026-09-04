import badge from "../../../public/assetss/images/verified-icon.png"

const VerifiedBadge = () => {
  return (
    <div>
      <img 
        src={badge}
        alt="AI"
        height={18}
        width={18}
        className="bgd"
      />
    </div>
  )
}

export default VerifiedBadge