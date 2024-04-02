import styled from "styled-components";
import {FlexBox} from "@/components/common";
import {CheckCircle, ExternalLink, Heart, PlusSquare, Star} from "react-feather";
import APIClient from '../services/api'
import {useAuthContext} from "@/context/auth.context";
import {theme} from "@/styles/themes";
import {useState} from "react";
import {notification, Spin, Tooltip} from "antd/lib";
import {useQueryClient} from "react-query";
import {useAppContext} from "@/context/app.context";

const YelpResult = ({business, minimal = false}) => {
    const  {user} = useAuthContext();
    const {openAddToPlanModal, openLoginModal, setShowAddToPlanModal} = useAppContext();
    const client = useQueryClient();
    const [isLoading, setIsLoading] = useState(false)
    const [isInterested, setIsInterested] = useState(business.isInterested)
    const businessAddress = !minimal && business.location.display_address.join(', ')

    const getRatingStars = () => {
        let stars = [];

        for (let i = 0; i < business.rating; i++) {
            stars.push(<Star key={i} size={12} />);
        }

        return stars;
    };

    const handleInterestClick = (interestId) => async () => {

        if (!user) {
            return openLoginModal();
        }

        const type = !isInterested ? 'add' : 'remove'
        setIsLoading(true)

        await APIClient.api.post(`/yelp/interest/${type}`, {
            businessId: business.id,
            businessName: business.name,
            img: business.image_url
        }).then(() => {
            client.refetchQueries(['interests', user?.id])
            setIsInterested(!isInterested)
            setIsLoading(false)

        }).catch(e => {
            console.log(`error??` + e)
            setIsLoading(false)

            notification.error({
                message: 'Something went wrong',
                placement:'bottomRight'
            })
        })
    }

    const handleAddToPlan = (business) =>  () => {
        setShowAddToPlanModal(business);
    }

    const imgUrl = minimal ? business?.businessMeta?.imgUrl : business?.image_url
    const businessName = minimal ? business?.businessMeta.name : business?.name
    return (
        <Spin spinning={isLoading}>
            <Container   align={'flex-start'}>

                <div className={'img-container'}>
                    <img src={imgUrl} className={'business-img'} />
                </div>
                <div className={'business-info'}>
                    <div className={'business-name'}>
                        {businessName}
                    </div>
                    {!minimal && (
                        <>
                            <div className={'address'}>
                                {businessAddress}
                            </div>
                            <div className={'ratings'}>
                    <span>
                        {getRatingStars()}  {business.rating}
                    </span>
                            </div>
                            <div className={'phone'}>
                                {business.display_phone}
                            </div>
                        </>
                    )}
                </div>
                {
                    !minimal && (
                        <FlexBox justify={'flex-end'} wrap={'no-wrap'} gap={12} align={'flex-end'} className={'action'}>
                            {/*<Tooltip title={}>*/}


                                <PlusSquare  onClick={ handleAddToPlan(business)}/>
                            {/*</Tooltip>*/}

                            <Tooltip title={`${isInterested ? 'Remove from' : 'Add to'} interests`}>
                                {isInterested ?
                                    <CheckCircle  onClick={ handleInterestClick(business.id)} color={theme.lightGreen}/>
                                    :
                                    <Heart  onClick={ handleInterestClick(business.id)}/>
                                }
                            </Tooltip>
                            <Tooltip title={'Visit on Yelp'}>
                                <a style={{color: "black"}} target="_blank" href={business?.url} rel="noopener noreferrer">

                                <ExternalLink />
                                </a>
                            </Tooltip>


                        </FlexBox>
                    )
                }
            </Container>
        </Spin>
    )
}


export default YelpResult;

const Container = styled(FlexBox)`
  padding: 12px;
  margin: 18px 0px;
  min-width: 250px;
  border-bottom: 2px solid #e6e6e6;
  &:hover {
  border: 2px solid #e6e6e6;
}
  //max-width: 400px;
  
  border-radius: 12px;
  //max-width: 250px;
  
  :hover {
    cursor: pointer;
    //border: 2px solid crimson;
    //filter: drop-shadow(0 0 0.75rem crimson);    //box-shadow: 1px 1px 1px 1px #e6e6e6;
  }
  
    .img-container {
      width: 100%;
      height: 150px;
    }
  
  .business-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  
  .business-info {
    width: 100%;
    //margin: 0px 12px;
    padding: 4px;
    min-height: 75px;
    max-height: 75px;
    color: black;
    //background-color: #e8e8e8;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  
  .business-name {
    font-weight: 500;
    font-size: 18px;
  }
  
  .address {
    padding-top: 4px;
    font-size: 12px;
    //max-width: 100px;
  }
  
  .action {
    padding: 0px 24px;
    cursor: pointer;
    height: 100%;
  }
`
