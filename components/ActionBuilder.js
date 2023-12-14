import styled from 'styled-components';
import {Button} from "antd/lib";
import {FlexBox} from "@/components/common";
import {useAppContext} from "@/context/app.context";

const ActionBuilder = ({arr = [], setArr, buttons = []}) => {

    const {completeTasks, moveToTrash} = useAppContext();

    if (arr.length === 0) return null;
    const handleUnselect = () => {
        setArr([])
    }



    const btnConfig = [
        {
            onClick:  completeTasks(arr),
            className: 'btn complete-btn',
            label: `Complete ${arr.length} tasks`
        },
        {
            onClick: moveToTrash(arr),
            className: 'btn delete-btn',
            label: `Delete ${arr.length} tasks`
        },
        {
            onClick: handleUnselect,
            className: 'btn unselect-btn',
            label: `Unselect ${arr.length} tasks`
        },
    ]


    return (
        <Container gap={8}>

          {btnConfig.map((button, index) => {
            return (
                <Button key={`action-btn=${index}`} onClick={button.onClick} className={button.className}>{button.label} </Button>
            )
          })}
          {/*<Button onClick={completeTasks(selectedTasks)} className={'btn complete-btn'}>*/}
          {/*  Complete {selectedTasks.length} tasks*/}
          {/*</Button>*/}

          {/*<Button onClick={moveToTrash(selectedTasks)} className={'btn delete-btn'}>*/}
          {/*  Delete {selectedTasks.length} tasks*/}
          {/*</Button>*/}
          {/*<Button onClick={handleUnselect} className={'btn unselect-btn'}>*/}
          {/*  Unselect {selectedTasks.length} tasks*/}
          {/*</Button>*/}
        </Container>
    );
}

export default ActionBuilder;

const Container = styled(FlexBox)`


  .btn {
    border: none;
    font-weight: 600;
  }

  .complete-btn {
    background-color:#96E6B3;

  }

  .important-btn{
    background-color: #F3DFA2;
  }

  .delete-btn{
    background-color: #df2935;
  }

  .unselect-btn{
    background-color: #FBFEF9;
  }
`
