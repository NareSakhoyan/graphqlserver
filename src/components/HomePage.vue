<template>
    <div class="home">
        <div class="items">
            <tbody>
                <div class="">
                    <tr class="item-header">
                        <td>Status</td>
                        <td>Time</td>
                        <td>Full Name</td>
                        <td>Birthday</td>
                        <td>Address</td>
                        <td>Gender</td>
                        <td>Company Name</td>
                        <td>Company Number</td>
                        <td>Company Address</td>
                    </tr>
<!--                    <Item :item-details="item" />-->
                    <tr class="item" v-for="(item, index) in items" :key="index">
                        <td>{{getStatus(item.status)}}</td>
                        <td>{{getDate(item.createdAt)}}</td>
                        <td>{{getFullName(item.request.employee)}}</td>
                        <td>{{getDate(item.request.employee.employeeBirth.date)}}</td>
                        <td>{{getAddress(item.request.employee.employeeAddress)}}</td>
                        <td>{{getGender(item.request.employee)}}</td>
                        <td>{{item.request.company.companyName}}</td>
                        <td>{{item.request.company.companyNumber}}</td>
                        <td>{{getAddress(item.request.company.companyAddress)}}</td>
                    </tr>
                </div>
            </tbody>
        </div>
    </div>
</template>

<script>
    import gql from 'graphql-tag'
    // import Item from "./Item";

    export default {
        name: "HomePage",
        components: {
            // Item
        },
        apollo: {
            items: gql`query {
                      items {
                        id
                        status
                        createdAt
                        request {
                          timeStamp \t
                          company {
                            companyName
                            companyNumber
                            companyAddress {
                              countryCode
                              cityName
                              zipCode
                              address
                            }
                          }
                          employee {
                            firstName
                            lastName
                            insuranceNumber
                            citizenship
                            group
                            employeeBirth {
                              name
                              date
                              place
                              gender
                            }
                            employeeAddress {
                              countryCode
                              cityName
                              zipCode
                              houseNumber
                              streetName
                            }
                          }
                        }
                      }
                    }`
        },
        methods: {
            getStatus(statusCode) {
                console.log(statusCode);
                return (statusCode == 200)? 'successful': 'unsuccessful'
            },
            getAddress(addressDetails) {
                console.log(addressDetails);
                let tmp = addressDetails.address || addressDetails.streetName
                return `${tmp?tmp+', ': ''}${addressDetails.cityName}`
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
        padding: 3px;
    }
    .item-header td{
        background-color: #9fdcdc;
    }
</style>