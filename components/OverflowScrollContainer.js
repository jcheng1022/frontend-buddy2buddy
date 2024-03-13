import React from 'react'
import styled from 'styled-components'
import {FlexBox, NoScrollbar} from "@/components/common";
import ArrowScroll from './ArrowScroll'
import {Image} from 'antd/lib'
import {theme} from "@/styles/themes";

const OverflowScrollContainer = ({ title, children, paginate, img }) => {
    const imgSize = 53

    return (
        <Container>
            <FlexBox className={'title'}>
                {!!img && (
                    <div style={{ width: imgSize, height: imgSize }}>
                        <Image width={img.width ?? imgSize} height={img.height ?? imgSize} src={img.url} />
                    </div>
                )}
                <h4>{title}</h4>
            </FlexBox>
            <ArrowScroll rootClass={'inner no-select'} scrollAmount={460} paginate={paginate}>
                {children}
            </ArrowScroll>
        </Container>
    )
}

export default OverflowScrollContainer

const Container = styled.div`
  position: relative;
  z-index: 0;
  
  h4 {
    color: white;
    margin: 0;
  }

  .title {
    padding-left: 48px;
    padding-top: 48px;
    gap: 12px;

    svg {
      color: ${theme.cyan};
    }

    @media only screen and (max-width: 830px) {
      padding-left: 24px;
    }
  }

  .inner {
    overflow-x: auto;
    ${NoScrollbar};
    gap: 24px;
    display: flex;
    flex-wrap: nowrap;
    margin-left: auto;
    padding-bottom: 4px;
    padding-top: 18px;
    padding-left: 48px;

    img {
      user-drag: none;
      -webkit-user-drag: none;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }

    @media only screen and (max-width: 830px) {
      padding-left: 24px;
    }

  }

  .ant-spin-blur::after {
    border-radius: 14px;
  }


  padding-right: 16px;
`
