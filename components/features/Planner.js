import styled from "styled-components";
import {useState} from "react";
import {Collapse} from "antd/lib";
import {FlexBox} from "@/components/common";
import {theme} from "@/styles/themes";
import PlannerResults from "@/components/features/PlannerResults";
import PlannerContext from "@/context/planner.context";
import PlannerForm from "@/components/features/PlannerForm";
import {AnimatePresence, motion} from 'framer-motion';

const PlannerFeature = () => {

    // ... (existing code)

    const [isPlannerFormVisible, setIsPlannerFormVisible] = useState(true);

    const handlePanelChange = (key) => {
        setIsPlannerFormVisible(prev => !prev);
    };

    return (
        <PlannerContext>
            <Container>

                <FlexBox align={'flex-start'} gap={24} style={{ width: '100%' }}>
                    {/*<div>*/}
                        <Collapse
                            className={'form-collapse'}
                            defaultActiveKey={['plannerForm']}
                            ghost
                            onChange={handlePanelChange}
                        >
                            <Collapse.Panel key="plannerForm">
                                <AnimatePresence>
                                    {isPlannerFormVisible && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <PlannerForm />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Collapse.Panel>
                        </Collapse>
                    {/*</div>*/}
                    {/*<motion.div*/}
                    {/*    animate={{ x: 100 }}*/}
                    {/*    transition={{ delay: 1 }}*/}
                    {/*>*/}
                        <PlannerResults key={`planner-results`} />
                    {/*</motion.div>*/}
                </FlexBox>
            </Container>
        </PlannerContext>
    )
}

export default PlannerFeature;

const Container = styled.div`
  
  .form-collapse {
    height: 100%;
    background-color: ${theme.softBlack};
  }
  .section-title {
    color: #FFFFFF;

  }
  
  .section-description {
    font-size: 12px;
    color: #DDDDDD;

  }
`
