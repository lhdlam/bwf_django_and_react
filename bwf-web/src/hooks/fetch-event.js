import  {useState, useEffect} from 'react';
import { getEvent } from '../services/event-services';


export function useFetchEvent(token, eventId){
    const [ event, setEvent] = useState(null);
    const [ loading, setLoading] = useState(false);
    const [ error, setError] = useState(false);

    useEffect(() => {
        const getData = async () => {
            await getEvent(token, eventId).then(resp => setEvent(resp)).catch(() => setError(true))
        }
        setLoading(true)
        getData().catch(error => console.log(error));
        setLoading(false)
    }, [eventId])
    return [event, loading, error]
}