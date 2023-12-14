import styled from 'styled-components';
import {FlexBox} from "@/components/common";
import {Tag} from "antd/lib";
import {theme} from "@/styles/themes";
import dayjs from "dayjs";


const TaskBoard = ({ tasks = []}) => {
  const columns = Object.entries(tasks)
    return (
        <Container gap={36} align={'flex-start'}>
          {columns?.map(([date, tasksForDate]) =>{
            const isToday = dayjs(date).isToday();
            return (
                <TaskColumn key={date} isToday={isToday} >
                  <div className={'date-heading'}>{date}</div>

                  {tasksForDate.map((task, index) => {
                    let tagColor;

                    switch(task.status) {
                      case 'PENDING':
                        tagColor = theme.lavender;
                        break;
                      case 'STARTED':
                        tagColor = theme.lightLavender;
                        break;
                      case 'PENDING':
                        tagColor = theme.coolGray;
                        break;
                    }
                    return (
                        <TaskItem key={`task-${index}`}>
                          <FlexBox justify={'space-between'} className={'task-top-section'}>
                            <div className={'task-name'}> {task.name} </div>
                            <div> <Tag color={tagColor}> {task.status}</Tag></div>
                          </FlexBox>
                          <div className={'task-description'}> {task.description} </div>
                        </TaskItem>
                    )
                  })}

                </TaskColumn>
            )
          })}
        </Container>
    );
}

export default TaskBoard;

const Container = styled(FlexBox)`
  padding: 12px 24px;
`


const TaskColumn = styled.div`
  width: 250px;
  
  .date-heading {
    margin-bottom: 12px;
    font-size: 20px;
    font-weight: 500;
    color: ${props => props.isToday ? theme.steel40 : 'black'};
  }
`
const TaskItem = styled.div`
  border: 1px solid ${theme.lightLavender};
  padding: 12px;
  border-radius: 8px;
  margin: 8px 0px;
  
  .task-top-section {
    padding-bottom: 8px;
    border-bottom: 1px solid ${theme.lightLavender}
  }
  .task-description {
    padding-top: 8px;
  }
  
  &:hover {
    cursor: pointer;
  }
`
