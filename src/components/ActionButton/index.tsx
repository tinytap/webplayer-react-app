import React, { MouseEvent, ReactElement } from 'react'
import { ActionButtonContainer } from './styles'

interface ActionButtonProps {
    children: ReactElement
    animation?: 'fade' | 'scale' | undefined
    onClick?: (ev: React.MouseEvent<HTMLElement>) => void
}
export function ActionButton({ children, animation, onClick }: ActionButtonProps) {
    const handleButtonClick = (ev: React.MouseEvent<HTMLElement>) => {
        if (onClick) {
            onClick(ev)
        }
    }
    return (
        <ActionButtonContainer animation={animation} onClick={handleButtonClick}>
            {children}
        </ActionButtonContainer>
    )
}

