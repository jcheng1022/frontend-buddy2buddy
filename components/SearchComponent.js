import styled from "styled-components";
import {Button, Input} from "antd/lib";

const SearchComponent = () => {
    return (
        <Container>
            <Input className={'search-input'} placeholder={'breakfast, arcades, dinner'} />
            <Input className={'search-input'} placeholder={'location'} />
            <Button type={'primary'} className={'search-btn'}> Search</Button>
        </Container>
    )
}

export default SearchComponent;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
