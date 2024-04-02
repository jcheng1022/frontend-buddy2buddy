import styled from "styled-components";
import {Button, Input, notification, Tooltip} from "antd/lib";
import {FlexBox} from "@/components/common";
import {useEffect, useState} from "react";
import APIClient from '../services/api'
import {useAppContext} from "@/context/app.context";
import Storage from "@/services/storage";
import {useAuthContext} from "@/context/auth.context";
import {Info} from "react-feather";

const YelpSearch = () => {
    const [ interestForm, setInterestForm ] = useState({
        businessName:'',
        location: '',
        limit: 10
    })
    const [fetchingLocation, setFetchingLocation] = useState(false)

    const {setYelpResults, setIsSearching} = useAppContext();
    const {user} = useAuthContext();
    const LOCATION_STORAGE_KEY = `${user?.id}@location`


    useEffect(() => {
        const fetchData = async () => {
            if ('geolocation' in navigator && !!user) {
                setFetchingLocation(true)
                navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                    const { latitude, longitude } = coords;

                    const coordinates = Storage.getItem(LOCATION_STORAGE_KEY)

                    if (!coordinates) {
                        Storage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
                            latitude: latitude,
                            longitude: longitude,
                            zip: ''
                        }))
                    }
                    if (latitude.toFixed(3) === coordinates?.latitude.toFixed(3) && longitude.toFixed(3) === coordinates?.longitude.toFixed(3)) {

                        if (!!coordinates?.zip) {
                            setInterestForm({
                                ...interestForm,
                                location: coordinates?.zip
                            })

                            setFetchingLocation(false)
                            return;
                        }

                    } else {
                        Storage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
                            latitude: latitude,
                            longitude: longitude,
                            zip: ''
                        }))
                    }

                    const apiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;

                    try {
                        // Make the API request
                        const response = await fetch(apiUrl);
                        const data = await response.json();
                        const zip = data.features[0].properties.postcode

                        // check if new zip code

                        if (coordinates?.zip?.toString() !== zip) {
                            const updated = Storage.getItem(LOCATION_STORAGE_KEY)
                            Storage.setItem(LOCATION_STORAGE_KEY, {
                                ...updated,
                                zip: zip
                            })
                            setInterestForm({
                                ...interestForm,
                                location: zip
                            })
                            setFetchingLocation(false)

                        }



                    } catch (error) {
                        if (fetchingLocation){
                            setFetchingLocation(false)
                        }
                        console.error('Error fetching reverse geocoding data:', error);
                    }
                });
            }
        };

        fetchData();



    }, [user]);



    const handleInputChange = (name) => (e) => {
        setInterestForm({
            ...interestForm,
            [name] : e.target.value
        })
    }

    const handleSubmit = () => {
        if (!interestForm.businessName) return;

        setIsSearching(true)
        return APIClient.api.post('/yelp', {
            name: interestForm.businessName,
            location: interestForm.location
        }).then((data) => {
            setYelpResults(data)
            setIsSearching(false)
        }).catch(e => {
            setIsSearching(false)
            notification.error({
                message: 'Search failed',
                placement: 'bottomRight',
                duration: 5
            })
        })
    }

    return (
        <Container>

            <FlexBox gap={12} wrap={'no-wrap'}>
                <Input
                    className={'yelp-search-input'}
                    value={interestForm.businessName}
                    placeholder={'Breakfast food'}
                    onChange={handleInputChange('businessName')}
                />
                <Input
                    className={'yelp-search-input'}
                    value={interestForm.location}
                    onChange={handleInputChange('location')}
                />
                <Button onClick={handleSubmit}>
                    Search
                </Button>
            </FlexBox>
            {/*{interestForm?.location === userZip && (*/}
                <FlexBox gap={8}>
                    <Tooltip title={'This zip code is set by your user preferences. To change, go to your account settings or use a seperate address entirely'}>
                        <Info size={14}  />
                    </Tooltip>
                    <div>
                        {!!fetchingLocation ? `Fetching your location...` : !!interestForm?.location ? `Using my location: ${interestForm?.location}` : `Geolocation disabled`}
                    </div>
                </FlexBox>
            {/*)}*/}
        </Container>
    )
}


export default YelpSearch;

const Container = styled.div`
  padding: 12px;

    .yelp-search-input {
      width: 250px;
    }
`
