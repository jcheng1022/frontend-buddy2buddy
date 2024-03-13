import styled from "styled-components";
import {FlexBox} from "@/components/common";
import YelpResult from "@/components/YelpResult";
import {theme} from "@/styles/themes";
import {Select} from "antd/lib";
import {useEffect, useState} from "react";
import {Filter} from "react-feather";
import {usePlannerContext} from "@/context/planner.context";
import {motion} from 'framer-motion'

const PlannerResults = () => {
    const {results, setResults} = usePlannerContext();

    console.log(`loaded`)
    const ResultList = () => {
        const [expandSettings, setExpandSettings] = useState(false)
        const [finalResults, setFinalResults] = useState(null)
        useEffect(() => {
            setFinalResults(results)
        }, [])

        const handleSortChange = (val) => {
            setFinalResults((prevResults) => {
                let sortedResults;

                if (val === 'ranking') {
                    sortedResults = [...prevResults].sort((a, b) => b.rating - a.rating);
                } else if (val === 'distance') {
                    sortedResults = [...prevResults].sort((a, b) => a.distance - b.distance);
                } else {
                    // Handle other cases if needed
                    sortedResults = [...prevResults];
                }

                return sortedResults;
            });
        };

        const sortOptions = [
            {
                label: 'Ranking (stars)',
                value: 'ranking',
            },
            {
                label: 'Distance',
                value: 'distance',
            },
        ]
        return (
            <div>
                <FlexBox justify={'space-between'}>
                    <div>
                        <div className={'result-title'}> Results</div>
                        <div className={'result-subtitle'}> Add places to list</div>
                    </div>
                    {/*<div className={'filter-icon'} onClick={() => setExpandSettings((prev) => !prev)}>*/}
                    {/*    <Filter />*/}
                    {/*</div>*/}
                </FlexBox>
                {/*{expandSettings && (*/}
                {/*    <div>*/}
                {/*        <div>*/}
                {/*            <span> Sort by</span>*/}
                {/*            <Select className={'filter-select'}*/}
                {/*                    onChange={handleSortChange}*/}
                {/*                    options={sortOptions} />*/}

                {/*        </div>*/}

                {/*    </div>*/}
                {/*)}*/}
                <FlexBox
                         gap={12}
                        justify={'space-around'}

                         className={'result-list-container'}>
                    {finalResults?.map((result, index) => {
                        return (
                            <motion.div
                                key={`planner-result-${index}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <YelpResult business={result}/>
                            </motion.div>
                            // <ResultItem key={`result-item-${index}`}>
                            //     <div>
                            //         {result.name}
                            //     </div>
                            // </ResultItem>
                        )
                    })}
                </FlexBox>
            </div>
        )
    }

    return (
        <Container>
            {/*<motion.div*/}
            {/*    animate={{ x: 100 }}*/}
            {/*    transition={{ delay: 1 }}*/}
            {/*>*/}
            {results ?
                // <motion.div
                //     animate={{ x: 100 }}
                //     transition={{ delay: 1 }}
                // >
                <ResultList/>
                // </motion.div>
                 :
                <div> no </div>}

            {/*</motion.div>*/}
        </Container>
    )
}

export default PlannerResults;

const Container = styled.div`
  margin: 24px 0px;
  width: 100%;
  
  .filter-icon {
    cursor: pointer;
  }
  .result-list-container {
    width: 100%;
    max-height: 500px;
    overflow-y: auto;
  }
  
  .result-subtitle{
    color: ${theme.steel60};
    font-size: 12px;
  }
  
  .filter-select { 
    width: 200px;
  }
`

const ResultItem = styled.div``
