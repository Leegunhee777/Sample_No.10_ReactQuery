import React from 'react';
import axios from 'axios';

import { useQuery, useQueryClient, useMutation } from 'react-query';

const AutoRefetching = () => {
  //내가 query를 사용하고자할때마다 선언해주어야하는것
  const queryClient = useQueryClient();
  const [intervalMs, setIntervalMs] = React.useState(2000);
  const [value, setValue] = React.useState('');

  //get요청같은 경우는 useQuery를 통해 선언후 사용하고,
  //post....등 나머지같은 경우는 useMutation을통해 선언후 사용하게된다.
  const { status, data, error, isFetching } = useQuery(
    'fruits',
    async () => {
      const res = await axios.get('/fruits');

      return res.data;
    },
    {
      // Refetch the data every second
      //useQuery로 query를 선언할때 이 옵션을 넣어서 선언하게되면 지속적으로 api콜을 때리게된다.
      //refetchInterval: 2000,
    }
  );

  //get을 제회한 요청의경우 useMutation을 사용하여 선언하게되고,
  //useMutaion을통해 선언되어진 addMution함수는
  //addMutaion.mutate 처럼 사용하게된다.
  const addMutation = useMutation(
    async value => {
      const reponse = await axios.post('/fruits/add', value);
      return reponse;
    },
    {
      //data는 내가 비동기 요청으로부터 return한 값이 넘어온다.
      // addMutation.mutate(value);를 통해 전달된인자가 variables로 들어오게된다.
      onSuccess: async (reponse, variables, context) => {
        setValue('');
        await queryClient.cancelQueries('fruits');
        //fruits key를 가지고있는 query의 데이터를 가져온다.
        const previousValue = queryClient.getQueryData('fruits');
        queryClient.setQueryData('fruits', old => [...old, reponse.data]);

        return previousValue;
      },
      onError: (error, variables, context) => {
        console.log('error');
        console.log(error);
      },
      onSettled: (data, error, variables, context) => {
        console.log('이건 그냥 실행되는거야');
        console.log(data);
      },
    }
  );

  const clearMutation = useMutation(() => fetch(`/fruits/clear`), {
    onSuccess: () => {
      //invalidateQueryies를 하면 queryState가 다 날아가게되고
      //uqeQuery에서의 Fetch get요청이 함께 추가로 요청되게된다.
      queryClient.invalidateQueries('fruits');
    },
  });

  //status의 로딩은 react query자체가 init되기 이전까지의 상태를 의미하는것이고,
  //fetching은  status의loading과는 좀 다르게,
  //추가적으로refetchInterval옵션을 통해 query를 선언할경우,
  //query init과는관계없이 지속해서 serverCall을 진행하게되는데,
  //해당 콜을 진행할때 추적할수있는게 ,isFetching이다.
  //대부분 status loading으로 카바되지만 그냥 알아둬라~
  if (status === 'loading') return <h1>Loading...</h1>;
  if (status === 'error') return <span>Error: {error.message}</span>;

  return (
    <div>
      <h1>Auto Refetch with stale-time set to 1s)</h1>
      <p>
        This example is best experienced on your own machine, where you can open
        multiple tabs to the same localhost server and see your changes
        propagate between the two.
      </p>
      <label>
        isFetching:
        <span
          style={{
            display: 'inline-block',
            marginLeft: '.5rem',
            width: 10,
            height: 10,
            background: isFetching ? 'green' : 'transparent',
            transition: !isFetching ? 'all .3s ease' : 'none',
            borderRadius: '100%',
            transform: 'scale(2)',
          }}
        />
      </label>
      <h2>Todo List</h2>
      <form
        onSubmit={event => {
          event.preventDefault();
          addMutation.mutate(value);
        }}
      >
        <input
          placeholder="enter something"
          value={value}
          onChange={ev => setValue(ev.target.value)}
        />
      </form>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => {
            clearMutation.mutate();
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};
export default AutoRefetching;
