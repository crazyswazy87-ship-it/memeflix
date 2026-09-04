import DomeGallery from "@/components/shared/DomeGallery"


const OccupationAll = () => {
  return (
    <div className="home-container">
      www
      <DomeGallery
      fit={0.8}
      minRadius={600}
      maxVerticalRotationDeg={7}
      segments={34}
      dragDampening={2}
      grayscale
    />
    </div>
  )
}

export default OccupationAll
