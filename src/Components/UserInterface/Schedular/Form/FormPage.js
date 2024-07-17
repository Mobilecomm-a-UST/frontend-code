
import React, { useEffect, useState } from 'react'


const FormPage = () => {
    const [checkValue, setCheckValue] = useState([])

    const arrData = ['Gwalior', 'Bhopal', 'Indore', 'Jabalpur']

    const person = {name:'Girraj',Worker:'Mobilecomm'}

    const params = new URLSearchParams(Object.entries(person))

    // console.log('aaasssddd' , document.cookie('csrftoken'))





    const input1 = { a: 1, b: 2, c: 3, d: 10, e: 12 }
    const input2 = { a: 2, e: 12, f: 6, d: 10 }



    // console.log('array object',Object.entries(input1))


    const functionTest = () => {

        // console.log('data', input3)

        const commonKeys = {};
        for (const [key,value] of Object.entries(input1)) {

            console.log('q', key, value)

            if (input2.hasOwnProperty(key)) {
                commonKeys[key] = input1[key];
            }
        }

        console.log('aa', commonKeys)


    }


    const getListValue = (e, index) => {
        // console.log('get data' , e.target.checked , index)
        setCheckValue((prevState) => ({
            ...prevState,
            [index]: e.target.checked,
        }))

    }

    const DeleteValue = (index) => {
        setCheckValue((prevState) => ({
            ...prevState,
            [index]: false,
        }))

    }

    useEffect(() => {
        functionTest()
    }, [])




    return (
        <div>

            <ul style={{ listStyleType: 'none', fontSize: '18px', marginTop: '10px' }}>
                {arrData.map((item, index) => (
                    <li key={index}>
                        <input type='checkbox' checked={checkValue[index]} onChange={(e) => { getListValue(e, index) }} />
                        {item}
                        <span style={{ display: checkValue[index] ? 'inherit' : 'none' }} onClick={() => { DeleteValue(index) }}><button>Delete</button></span>
                    </li>
                ))}
            </ul>





        </div>
    )
}




export default FormPage