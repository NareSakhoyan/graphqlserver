<template>
    <tr class="item">
        <td>{{getStatus(itemDetails.status)}}</td>
        <td>{{getDate(itemDetails.createdAt)}}</td>
        <td>{{getFullName(itemDetails.request.employee)}}</td>
        <td>{{getDate(itemDetails.request.employee.employeeBirth.date)}}</td>
        <td>{{getAddress(itemDetails.request.employee.employeeAddress)}}</td>
        <td>{{getGender(itemDetails.request.employee)}}</td>
        <td>{{itemDetails.request.company.companyName}}</td>
        <td>{{itemDetails.request.company.companyNumber}}</td>
        <td>{{getAddress(itemDetails.request.company.companyAddress)}}</td>
    </tr>
</template>

<script>
    export default {
        name: "Item",
        props: {
            itemDetails: {
                default: {}
            }
        },
        methods: {
            getStatus(statusCode) {
                console.log(statusCode);
                return (statusCode == 200)? 'successful': 'unsuccessful'
            },
            getAddress(addressDetails) {
                return `${addressDetails.address}, ${addressDetails.cityName}`
            },
            getFullName(userDetails) {
                return `${userDetails.firstName} ${userDetails.lastName}`
            },
            getDate(date) {
                date = new Date(date)
                // console.log(date, `${date.getUTCDate()+1}/${date.getMonth()+1}/${date.getFullYear()}`)
                return `${date.getDay()+1}/${date.getMonth()+1}/${date.getFullYear()}`
            },
            getGender(user) {
                // if (!user.employeeBirth.toString()) return 'null'
                let gender = user.employeeBirth.gender
                if (gender === "M") return 'man'
                if (gender === "W") return 'woman'
                return 'other'
            }
        },
    }
</script>

<style scoped>
td {
    border: 1px solid black;
}
</style>