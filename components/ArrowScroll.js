import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import {ChevronLeft, ChevronRight} from 'react-feather'
import {theme} from "@/styles/themes";

const ArrowScroll = ({ children, rootClass, scrollAmount, height = 200, paginate}) => {

    const [state, setState] = useState({
        isScrolling: false,
        clientX: 0,
        scrollX: 0
    })

    const [position, setPosition ] = useState(0)

    const ref = useRef()

    const onMouseDown = e => {
        setState({
            ...state,
            isDown: true
        })
    }

    const onMouseUp = () => {
        setState({ ...state, isScrolling: false, isDown: false })
    }

    const onMouseMove = e => {
        const { clientX, scrollX } = state
        if (state.isDown && e.clientX) {
            ref.current.scrollLeft = -1 * (scrollX + e.clientX - clientX)
            setState({
                ...state,
                isScrolling: true,
                scrollX: scrollX + e.clientX - (clientX || 0),
                clientX: e.clientX
            })
        }
    }

    const scroll = (direction) => async () => {

        const newPos =  ref.current.scrollLeft + scrollAmount;
        let last = ref.current.scrollLeft;
        while (ref.current.scrollLeft < newPos) {
            ref.current.scrollLeft += (direction === 'right' ? 20 : -20)
            if (ref.current.scrollLeft === last) {
                return;
            }

            last = ref.current.scrollLeft;
            setPosition(ref.current.scrollLeft)

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 10)
            })
        }
    }

    const MIN_DISTANCE = 100

    const approachingEnd = ref.current?.scrollLeft + ref.current?.offsetWidth >= ref.current?.scrollWidth - 100

    return (
        <Container ref={ref}
            // onMouseDown={onMouseDown}
            // onMouseUp={onMouseUp}
            // onMouseMove={onMouseMove}
            // onMouseLeave={onMouseUp}
                   className={rootClass}>
            {  paginate &&
                <ArrowContainer direction={'left'} height={height} onClick={scroll('left')}>
                <ChevronLeft size={100} color={'white'} />
            </ArrowContainer>
            }

            {children}

            {paginate  && <ArrowContainer direction={'right'} height={height} onClick={scroll('right')}>
                <ChevronRight size={100} color={'white'} />
            </ArrowContainer>}
        </Container>
    )
}

export default ArrowScroll

const Container = styled.div`
  position: relative;
  background-color: ${theme.lilac};

`

const ArrowContainer = styled.div`
  position: sticky;
  border-radius: 14px;
  width: 80px;
  height: ${props => props.height}px;
  background: ${props => props.direction === 'right' ? 'linear-gradient(270deg, #060F40 -95.24%, rgba(0, 0, 0, 0) 100%)' : 'none'};

  left:0;
  right: 0;
  bottom: 0;
  z-index: 999;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    cursor: pointer;
  }
`
