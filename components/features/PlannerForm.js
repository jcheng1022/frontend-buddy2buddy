// import styled from "styled-components";
// import {Button, Input, notification, Select} from "antd/lib";
// import {capitalizeWords} from "@/utils/capitalizeWords";
// import {FlexBox} from "@/components/common";
// import {Trash2} from "react-feather";
// import {theme} from "@/styles/themes";
// import {useState} from "react";
// import APIClient from "@/services/api";
// import {usePlannerContext} from "@/context/planner.context";
//
// import { motion } from 'framer-motion'
// const ColoredLine = ({ color = theme.steel10, height = 3, width = 10, rounded = false }) => (
//     <hr
//         style={{
//             color: color,
//             backgroundColor: color,
//             height,
//             width,
//             border: 'none',
//             borderRadius : rounded && '24px'
//         }}
//     />
// );
// const locationPlaceholders = [
//     '123 Apple Street, Orangeville, CA 98765',
//     '99 Buddy Avenue, Springville, NY 54321',
//     '42 Cherry Lane, Pineville, TX 12345',
//     '789 Pine Road, Mapleville, FL 67890',
//     '56 Oak Circle, Cedarville, WA 34567',
//     '654 Elm Court, Birchville, AZ 87654',
//     '32 Maple Drive, Willowville, GA 23456',
//     '876 Cedar Boulevard, Juniperdale, NC 78901',
//     '102 Palm Street, Palmville, OH 45678',
//     '567 Birch Lane, Redwoodville, MI 21098',
// ];
//
// const categoryOptions = [
//     'breakfast',
//     'arcades',
//     'dinner'
// ]
// const PlannerForm = () => {
//
//     const {planningForm, setPlanningForm, results, setResults, isLoading, setIsLoading } = usePlannerContext();
//
//     const handleCategoryChange = (selectedCategories) => {
//
//         console.log(selectedCategories, 'sdsdssf')
//         setPlanningForm((prevForm) => {
//             const existingCategories = prevForm.categories.filter(cat => cat.isCustom);
//             const newCategories = selectedCategories.map(cat => ({
//                 isCustom: false,
//                 category: cat
//             }));
//
//             return {
//                 ...prevForm,
//                 categories: [...existingCategories, ...newCategories],
//             };
//         });
//     };
//
//     const handleLocationChange = (index) => (e) => {
//         const { value } = e.target;
//
//         setPlanningForm((prevForm) => {
//             const updatedLocations = [...prevForm.locations];
//             updatedLocations[index].address = value;
//
//             return {
//                 ...prevForm,
//                 locations: updatedLocations
//             };
//         });
//     };
//
//     const handleDeleteLocation =(index) => () => {
//         if (planningForm?.locations?.length === 1) {
//             return notification.error({
//                 message: 'Cannot have less than one location',
//                 placement: 'bottomRight'
//             })
//
//         }
//
//         setPlanningForm((prevForm) => {
//             const updatedLocations = [...prevForm.locations];
//             updatedLocations.splice(index, 1)
//
//             return {
//                 ...prevForm,
//                 locations: updatedLocations
//             };
//         });
//     }
//
//     const handleAddNewLocation = () => {
//
//         if (planningForm?.locations.length > 3) {
//             return notification.error({
//                 message: 'Cannot have more than 3 locations',
//                 placement: 'bottomRight'
//             })
//         }
//         setPlanningForm((prevForm) => {
//             const updatedLocations = [...prevForm.locations];
//             updatedLocations.push({
//                 index: prevForm.locations.length,
//                 address: ''
//             })
//
//             return {
//                 ...prevForm,
//                 locations: updatedLocations
//             };
//         });
//     }
//
//     const handleCustomCategory = (e) => {
//
//         const customCategoryIndex = planningForm.categories.findIndex(category => category.isCustom);
//
//         setPlanningForm((prevForm) => {
//             const updatedCategories = [...prevForm.categories];
//
//             if (customCategoryIndex !== -1) {
//
//                 if (e.target.value.length === 0) {
//                     // if value is cleared, remove from category array
//                     updatedCategories.splice(customCategoryIndex, 1)
//                 } else {
//                     updatedCategories[customCategoryIndex].category = e.target.value;
//                 }
//
//             } else {
//                 // Add new custom category to array
//                 updatedCategories.push({
//                     isCustom: true,
//                     category: e.target.value
//                 });
//             }
//
//             return {
//                 ...prevForm,
//                 categories: updatedCategories
//             };
//         });
//     };
//
//     const handleSubmit = () => {
//         if (planningForm?.categories.length === 0 ) {
//             return notification.error({
//                 message: 'Missing category',
//                 description: 'Must have at least 1 category',
//                 placement: 'bottomRight'
//             })
//         }
//
//         if (!planningForm?.locations?.every(o => !!o.address)) {
//             return notification.error({
//                 message: 'Missing address',
//                 description: 'Locations must have addresses',
//                 placement: 'bottomRight'
//             })
//         }
//         setIsLoading(true)
//         return APIClient.api.post(`/planner`, planningForm).then((data) => {
//             setResults(data)
//         } ).finally(() => {
//             setIsLoading(false)
//         })
//     }
//     return (
//        // <motion.div
//        //     animate={{x: 100}}
//        //     transition={{delay: 1}}>
//            <Container>
//                <SectionContainer>
//                    <div className={'section-title'}>
//                        Category
//                    </div>
//                    <div className={'section-description'}>
//                        {`Select one or more categories. If you can't find the category you're looking for, you can add it`}
//                    </div>
//                    <Select
//                        mode="multiple"
//                        allowClear
//                        style={{
//                            width: '100%',
//                        }}
//                        placeholder="Please select"
//
//                        value={planningForm?.categories
//                            .filter(cat => !cat.isCustom)
//                            .map(cat => cat.category)}
//
//                        onChange={handleCategoryChange}
//                        options={categoryOptions.map(o => {
//                            return {
//                                label: capitalizeWords(o),
//                                value: o
//                            }}
//                        )}
//                    />
//                    <FlexBox justify={'center'} className={'custom-search-container'}>
//                        <ColoredLine width={50} rounded/>
//                        <div className={'custom-search-label'}> Add a custom category (optional) </div>
//                        <ColoredLine width={50}/>
//
//                    </FlexBox>
//
//                    <Input
//                        placeholder={'e.g: Korean soondubu'}
//                        onChange={handleCustomCategory}
//                    />
//
//                </SectionContainer>
//                <SectionContainer>
//
//                    <div className={'section-title'}>
//                        Locations
//                    </div>
//                    <div className={'section-description'}>
//                        {`Add between 1 to 3 locations, we'll try our best to tailor our results to fit all locations`}
//                    </div>
//                    <FlexBox justify={'flex-end'} style={{
//                        margin: '20px 0px'
//                    }}>
//                        <Button onClick={handleAddNewLocation}>
//                            Add Location
//                        </Button>
//                    </FlexBox>
//                    {
//                        planningForm?.locations?.map((location, index) => {
//                            return (
//                                <LocationInputContainer key={`planning-form-input-${index}`}>
//                                    <FlexBox className={'location-input-label'} justify={'space-between'}>
//                                        <div className={'input-label'}>
//                                            {`Location ${index + 1}`}
//                                        </div>
//                                        <div onClick={handleDeleteLocation(index)} className={'delete-action'}>
//                                            <Trash2 size={16} />
//                                        </div>
//                                    </FlexBox>
//                                    <Input value={location.address}
//                                           placeholder={locationPlaceholders[index]}
//                                           onChange={handleLocationChange(index)}
//                                    />
//                                </LocationInputContainer>
//                            )
//                        })
//                    }
//                </SectionContainer>
//
//
//                <SectionContainer>
//                    <Button style={{width: '100%'}}
//                            onClick={handleSubmit}
//                            loading={isLoading}
//                    > Search</Button>
//                </SectionContainer>
//            </Container>
//        // </motion.div>
//     )
// }
//
// export default PlannerForm;
//
// const Container = styled.div``
//
// const SectionContainer = styled.div`
//   margin: 24px 0px;
//
//   .custom-search-label {
//     font-size: 12px;
//     color: ${theme.steel20};
//   }
//
//   .custom-search-container{
//     margin: 12px 0px;
//   }
// `
//
//
// const LocationInputContainer = styled.div`
//   margin: 8px 0px;
//   width: 100%;
//
//   .delete-action {
//     cursor: pointer;
//   }
//
//   .input-label {
//     font-size: 12px;
//     letter-spacing: .2px;
//   }
// `
//

import styled from "styled-components";
import {Button, Input, notification, Select} from "antd/lib";
import {capitalizeWords} from "@/utils/capitalizeWords";
import {FlexBox} from "@/components/common";
import {Trash2} from "react-feather";
import {theme} from "@/styles/themes";
import {useEffect} from "react";
import {usePlannerContext} from "@/context/planner.context";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import APIClient from "@/services/api";

const ColoredLine = ({ color = theme.steel10, height = 3, width = 10, rounded = false }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height,
            width,
            border: 'none',
            borderRadius: rounded && '24px',
        }}
    />
);

const locationPlaceholders = [
    '123 Apple Street, Orangeville, CA 98765',
    '99 Buddy Avenue, Springville, NY 54321',
    '42 Cherry Lane, Pineville, TX 12345',
    '789 Pine Road, Mapleville, FL 67890',
    '56 Oak Circle, Cedarville, WA 34567',
    '654 Elm Court, Birchville, AZ 87654',
    '32 Maple Drive, Willowville, GA 23456',
    '876 Cedar Boulevard, Juniperdale, NC 78901',
    '102 Palm Street, Palmville, OH 45678',
    '567 Birch Lane, Redwoodville, MI 21098',
];

const categoryOptions = ['breakfast', 'arcades', 'dinner'];

const PlannerForm = () => {
    const { planningForm, setPlanningForm, results, setResults, isLoading, setIsLoading } = usePlannerContext();
    const { handleSubmit, control, setValue, getValues, register, reset } = useForm({
        defaultValues: planningForm,
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'locations',
    });

    useEffect(() => {
        reset(planningForm);
    }, [planningForm, reset]);

    const handleCategoryChange = (selectedCategories) => {
        setPlanningForm((prevForm) => {
            const existingCategories = prevForm.categories.filter((cat) => cat.isCustom);
            const newCategories = selectedCategories.map((cat) => ({
                isCustom: false,
                category: cat,
            }));

            return {
                ...prevForm,
                categories: [...existingCategories, ...newCategories],
            };
        });
    };

    const handleLocationChange = (index) => (e) => {
        const { value } = e.target;

        setValue(`locations[${index}].address`, value);
    };

    const handleDeleteLocation = (index) => () => {
        if (fields.length === 1) {
            return;
        }

        remove(index);
    };

    const handleAddNewLocation = () => {
        if (fields.length >= 3) {
            return;
        }

        append({ address: '' });
    };

    const handleCustomCategory = (e) => {
        const customCategoryIndex = planningForm.categories.findIndex((category) => category.isCustom);
        if (customCategoryIndex !== -1) {
            if (e.target.value.length === 0) {
                setValue(`categories[${customCategoryIndex}].category`, '');
            } else {
                setValue(`categories[${customCategoryIndex}].category`, e.target.value);
            }
        } else {
            setValue(`categories[${customCategoryIndex}]`, {
                isCustom: true,
                category: e.target.value
            });

            // append({ isCustom: true, category: e.target.value });
        }
    };

    const onSubmit = () => {
        const formData = getValues();
        // Your existing submit logic

        if (formData?.categories.length === 0 ) {
            return notification.error({
                message: 'Missing category',
                description: 'Must have at least 1 category',
                placement: 'bottomRight'
            })
        }

        if (!formData?.locations?.every(o => !!o.address)) {
            return notification.error({
                message: 'Missing address',
                description: 'Locations must have addresses',
                placement: 'bottomRight'
            })
        }
        setIsLoading(true)
        return APIClient.api.post(`/planner`, formData).then((data) => {
            setResults(data)
        } ).finally(() => {
            setIsLoading(false)
        })
    };

    return (
        <Container>
            <SectionContainer>
                <div className={'section-title'}>Category</div>
                <div className={'section-description'}>
                    {`Select one or more categories. If you can't find the category you're looking for, you can add it`}
                </div>
                <Controller
                    render={({ field }) => (
                        <Select
                            // className={'ant-select-bb'}
                            mode="multiple"
                            allowClear
                            style={{
                                width: '100%'
                        }}
                            placeholder="Please select"
                            value={field.value.map((cat) => cat.category)}
                            onChange={(selectedCategories) => {
                                field.onChange(selectedCategories);
                                handleCategoryChange(selectedCategories);
                            }}
                            options={categoryOptions.map((o) => ({
                                label: capitalizeWords(o),
                                value: o,
                            }))}
                        />
                    )}
                    name="categories"
                    control={control}
                />
                <FlexBox justify={'center'} className={'custom-search-container'}>
                    <ColoredLine width={50} rounded />
                    <div className={'custom-search-label'}> Add a custom category (optional) </div>
                    <ColoredLine width={50} />
                </FlexBox>
                <Controller
                    render={({ field }) => <Input placeholder={'e.g: Korean soondubu'} {...field} onChange={handleCustomCategory} />}
                    name="customCategory"
                    control={control}
                />
            </SectionContainer>
            <SectionContainer>
                <div className={'section-title'}>Locations</div>
                <div className={'section-description'}>
                    {`Add between 1 to 3 locations, we'll try our best to tailor our results to fit all locations`}
                </div>
                <FlexBox justify={'flex-end'} style={{ margin: '20px 0px' }}>
                    <Button onClick={handleAddNewLocation}>Add Location</Button>
                </FlexBox>
                {fields.map((location, index) => (
                    <LocationInputContainer key={location.id}>
                        <FlexBox className={'location-input-label'} justify={'space-between'}>
                            <div className={'input-label'}>{`Location ${index + 1}`}</div>
                            <div onClick={() => handleDeleteLocation(index)} className={'delete-action'}>
                                <Trash2 size={16} />
                            </div>
                        </FlexBox>
                        <Controller
                            render={({ field }) => <Input value={field.value} placeholder={locationPlaceholders[index]} onChange={handleLocationChange(index)} />}
                            name={`locations[${index}].address`}
                            control={control}
                        />
                    </LocationInputContainer>
                ))}
            </SectionContainer>
            <SectionContainer>
                <Button style={{ width: '100%' }} onClick={handleSubmit(onSubmit)} loading={isLoading}>
                    Search
                </Button>
            </SectionContainer>
        </Container>
    );
};

export default PlannerForm;

const Container = styled.div`
  
  padding: 24px;

  .
   ::placeholder {
    color: red;
  }
  .ant-select-selection {
    background-color: ${theme.softBlack};
  }
  .ant-input {
    background-color: ${theme.softBlack};
    border: 2px solid ${theme.steel20};
    color: white;
    
  }
  
  .ant-collapse {
    background-color: ${theme.softBlack};
  }
`;

const SectionContainer = styled.div`
  margin: 24px 0px;

  .custom-search-label {
    font-size: 12px;
    color: ${theme.steel20};
  }

  .custom-search-container {
    margin: 12px 0px;
  }
`;

const LocationInputContainer = styled.div`
  margin: 8px 0px;
  width: 100%;

  .delete-action {
    cursor: pointer;
  }
  
  .input-label {
    color: white;
  }

`
