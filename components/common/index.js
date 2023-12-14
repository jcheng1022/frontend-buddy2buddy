import React from "react"
import styled from "styled-components"


export const Gap = styled.div`
  height: ${props => props.gap}px;
`
export const ColorScrollBar = (color = 'white', barWidth = 6, track = 'transparent') => `
/* width */
::-webkit-scrollbar {
    height: ${barWidth}px;
    width: ${barWidth}px;
}

/* Track */
::-webkit-scrollbar-track {
  background-color: ${track};
  border: none;
    border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: ${color};
  border-radius: 10px;
}
`


export const FlexBox  = styled.div`
  display: flex;
  
  ${props => {
    if (props.flip) {
        return `
          flex-direction: ${props.direction || 'row'} !important;
          @media only screen and (max-width: ${props.flip}px) {
            flex-direction: ${!props.direction ? 'column' : props.direction === 'row' ? 'column' : 'row'} !important;
          }
      `
    }
    return `
      flex-direction: ${props.direction || 'row'};
    `
}};
  ${props => {
    if (props.fluid) {
        return `width: 100%;`
    }
    return ''
}}
  flex-wrap: ${props => props.wrap || 'wrap'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'center'};
  flex: ${props => props.flex === undefined ? 1 : props.flex};
  gap: ${props => props.gap + 'px' || 'unset'};
  ${props => props.scrollX ? {"overflowX": "auto"} : {}};
`
