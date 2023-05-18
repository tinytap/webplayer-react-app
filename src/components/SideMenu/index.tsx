import { useGameStore } from '../../stores/gameStore'
import { usePlayerStore } from '../../stores/playerStore'
import { SERVER_BASE } from '../../utils/constants'
import { getEngineString } from '../../utils/tt-utils'
import { SlideThumbnail } from '../SlideThumbnail'
import {
  SideMenuContainer,
  SlidesMenuContainer,
  SideMenuHeaderContainer,
  SideMenuBox,
  GameAuthorBox,
  GameAuthorAvatarContainer,
  GameAuthorDetailsContainer,
  GameAuthorDetailsTopLine,
  GameAuthorDetailsBottomLine,
  GameAuthorAvatar,
  GameAuthorShareButton,
  GameAuthorShareContainer,
  GameAuthorAvatarLink,
} from './styles'

interface SideMenuProps {}
export function SideMenuHeader({}: SideMenuProps) {
  const author = useGameStore((state) => state.author)
  return author && author.id ? (
    <SideMenuHeaderContainer>
      <GameAuthorBox>
        <GameAuthorAvatarContainer>
          <GameAuthorAvatarLink href={`${SERVER_BASE}/community/profile/${author.username}/`} target="_blank">
            <GameAuthorAvatar src={author.picture} />
          </GameAuthorAvatarLink>
        </GameAuthorAvatarContainer>
        <GameAuthorDetailsContainer>
          <GameAuthorDetailsTopLine>Created by:</GameAuthorDetailsTopLine>
          <GameAuthorDetailsBottomLine href={`${SERVER_BASE}/community/profile/${author.username}/`} target="_blank">
            {author.first_name} {author?.last_name}
          </GameAuthorDetailsBottomLine>
        </GameAuthorDetailsContainer>
        <GameAuthorShareContainer>
          <GameAuthorShareButton>Share</GameAuthorShareButton>
        </GameAuthorShareContainer>
      </GameAuthorBox>
    </SideMenuHeaderContainer>
  ) : null
}
export function SideMenu({}: SideMenuProps) {
  const slides = useGameStore((state) => state.slides)
  const selectedSlide = useGameStore((state) => state.selectedSlide)
  const selectSlideIndex = useGameStore((state) => state.selectSlideIndex)
  const menuOpen = usePlayerStore((state) => state.menuOpen)

  return (
    <SideMenuContainer open={menuOpen}>
      <SideMenuBox>
        <SideMenuHeader />
        <SlidesMenuContainer>
          {slides?.map((slide, index) => (
            <SlideThumbnail
              image={slide.filePathImageThumb}
              key={'slide_' + slide.pk}
              engine={getEngineString(slide.engineType)}
              index={index + 1}
              selected={selectedSlide?.pk === slide.pk}
              onSelect={() => {
                if (selectSlideIndex) {
                  selectSlideIndex(index)
                }
              }}
            />
          ))}
        </SlidesMenuContainer>
      </SideMenuBox>
    </SideMenuContainer>
  )
}

