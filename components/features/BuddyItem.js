import styled from "styled-components";

const BuddyItem = ({buddy}) => {
    return (
        <Container>
            <div>
                {buddy?.friendName}
            </div>
        </Container>
    )
}


export default BuddyItem;

const Container = styled.div`
  border: 1px solid white;
  width: 100%;
  padding: 12px;
`
