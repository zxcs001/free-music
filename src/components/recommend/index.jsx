import React, { useEffect, useState, useRef } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { getRecommend, getDiscList } from '../../api/recommend'
import { ERR_OK, ERR_OK_lOCAL } from '../../api/config'
import Slider from '../../controls/slider'
import Scroll from '../../controls/scroll'
import Loading from '../../controls/loading'
import './index.stylus'
import 'react-lazy-load-image-component/src/effects/blur.css'

function Recommend() {
	
	let checkLoaded = false
	const [slider, setSlider] = useState([])
	const [discList, setDiscList] = useState([])
	const [needFresh, setNeedFresh] = useState(false)

	const recommendRef = useRef()

	useEffect(() => {
		getRecommend()
			.then(res => {
				if (res.code === ERR_OK) {
					const { slider } = res.data
					setSlider(slider)
				}
			})

		getDiscList().then(res => {
			if (res.code === ERR_OK_lOCAL) {
				const { playlists } = res
				setDiscList(playlists)
				// console.log(playlists)
			}
		})
	}, [])

  return (
		<div className="recommend" ref={recommendRef}>
			 <Scroll className="recommend-content" data={discList} needfresh={needFresh}>
					<div>
						<div className="slider-wrapper">
							<Slider loop={true} interval={4000} autoPlay={true}>
								{
									slider.length > 0 
									&&
									slider.map(item=>{
										return (
											<div key={item.id}>
												<a href={item.linkUrl}>
													<img src={item.picUrl} alt=""  onLoad={loadImage} className="needsclick" />
												</a>
											</div>
										)
									})
								}					
							</Slider>
						</div>
						<div className="recommend-list">
							<h1 className="list-title">
									热门歌单推荐
							</h1>
							<ul>
								{
									discList.map((item, index) => {
										return (
											<li className="item" key={item.id}>
													<div className="icon">
														<LazyLoadImage
															alt=""
															height={60}
															effect="blur"
															src={item.coverImgUrl} // use normal <img> attributes as props
															width={60} />
													</div>
													<div className="text">
														<h2 className="name">{item.creator.nickname}</h2>
														<p className="desc">{item.name}</p>
													</div>
											</li>
										)
									}) 
								}
							</ul>
						</div>
				</div>
				{
					!discList.length 
					&&
					<div className="loading-container">
						<Loading title="正在加载..."/>
					</div>
				}
				
			</Scroll>
		</div>
  )

	function loadImage() {
		if (!checkLoaded) {
			setNeedFresh(true)
			checkLoaded = true
			setNeedFresh(false)
		}
	}
}

export default Recommend