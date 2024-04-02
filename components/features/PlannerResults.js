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

    const ResultList = () => {
        const [finalResults, setFinalResults] = useState(null)
        useEffect(() => {
            setFinalResults(results)
        }, [])




        return (
            <div>
                <FlexBox justify={'space-between'}>
                    <div>
                        <div className={'result-title'}> Results</div>
                        <div className={'result-subtitle'}> Add places to list</div>
                    </div>

                </FlexBox>

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

                        )
                    })}
                </FlexBox>
            </div>
        )
    }

    return (
        <Container>

            {results ?

                <ResultList/>

                 :
                <div> no </div>}

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
