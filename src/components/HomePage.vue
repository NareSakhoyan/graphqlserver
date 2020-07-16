<template>
    <div class="home">
        <div class="items">
            <tbody>
                <div class="">
                    <tr class="item-header">
                        <td>
                            <b-dropdown
                                    @change="applyFilters"
                                    v-model="filterParams.status"
                                    multiple
                                    aria-role="list">
                                <button class="button is-primary" type="button" slot="trigger">
                                    <span>Status ({{ filterParams.status.length }})</span>
                                    <b-icon icon="menu-down"></b-icon>
                                </button>
                                <div v-for="(statCode, index) in Object.keys(statusCodes)" :key="`statusCode${index}`">
                                    <b-dropdown-item  :value="statCode" aria-role="listitem">
                                        <span>{{statusCodes[statCode]}}</span>
                                    </b-dropdown-item>
                                </div>
                            </b-dropdown>
                        </td>
                        <td>
                            <label>Request Date</label>
                            <b-field label="From" placeholder="Select a date" name="filterParams.requestDate">
                                <b-datepicker
                                        placeholder="Click to select..."
                                        v-model="requestStartDate"
                                        :max-date="requestEndDate">
                                </b-datepicker>
                            </b-field>
                            <b-field label="to" placeholder="Select a date" name="filterParams.requestDate">
                                <b-datepicker
                                        placeholder="Click to select..."
                                        v-model="requestEndDate"
                                        :min-date="requestStartDate"
                                        :max-date="requestEndDate">
                                </b-datepicker>
                            </b-field>
                        </td>
                        <td>Full Name</td>
                        <td>
                            <label>Birthday</label>
                            <b-field label="From" placeholder="Select a date" name="filterParams.requestDate">
                                <b-datepicker
                                        placeholder="Click to select..."
                                        v-model="birthdayStartDate"
                                        :max-date="birthdayEndDate">
                                </b-datepicker>
                            </b-field>
                            <b-field label="to" placeholder="Select a date" name="filterParams.requestDate">
                                <b-datepicker
                                        placeholder="Click to select..."
                                        v-model="birthdayEndDate"
                                        :min-date="birthdayStartDate"
                                        :max-date="birthdayEndDate">
                                </b-datepicker>
                            </b-field>
                        </td>
                        <td>Address</td>
                        <td>
                            <b-field label="Gender">
                                <b-select v-model="filterParams.gender" placeholder="Choose..." name="responseStatus">
                                    <option
                                            v-for="(gender, index) in Object.keys(genders)"
                                            :key="`gender${index}`"
                                            :value="gender">{{genders[gender]}}</option>
                                </b-select>
                            </b-field></td>
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
            <b-button class="button" @click="applyFilters">Update</b-button>
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
        data() {
          return {
              statusCodes: {
                  "200": "Ok",
                  "400": "Bad request",
                  "500": "Internal Server Error",
                  "700": "Maximum Invoke Depth Reached",
              },
              genders: {
                  "M": "Man",
                  "W": "Woman"
              },
              filterParams: {
                  requestDate: {
                      start: '',
                      end: new Date(),
                  },
                  birthdayDate: {
                      start: '',
                      end: new Date(),
                  },
                  status: [],
                  gender: '',
              }
          }
        },
        computed: {
            filters: {
                get() {
                    return this.filtersStr
                },
                set(v) {
                    console.log('Setting value to filters', v);
                }
            },
            requestStartDate: {
                get() {
                    return this.filterParams.requestDate.start
                },
                set(v) {
                    this.filterParams.requestDate.start = v
                }
            },
            requestEndDate: {
                get() {
                    return this.filterParams.requestDate.end
                },
                set(v) {
                    this.filterParams.requestDate.end = v
                }
            },
            birthdayStartDate: {
                get() {
                    return this.filterParams.birthdayDate.start
                },
                set(v) {
                    this.filterParams.birthdayDate.start = v
                }
            },
            birthdayEndDate: {
                get() {
                    return this.filterParams.birthdayDate.end
                },
                set(v) {
                    this.filterParams.birthdayDate.end = v
                }
            },
            genderModel: {
                get() {
                    return this.filterParams.gender
                },
                set(v) {
                    this.filterParams.gender = v
                }
            },
            filtersStr: () => "{\"status\":{\"$in\":[\"200\"]}}"
        },
        apollo: {
            items: {
                query: gql`query($filters: String) {
                      items(filters: $filters) {
                        id
                        status
                        createdAt
                        request {
                          timeStamp
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
                    }`,
                variables: {
                    filters: ''
                }
            }
        },
        methods: {
            getStatus(statusCode) {
                return (statusCode == 200)? 'successful': 'unsuccessful'
            },
            getAddress(addressDetails) {
                let tmp = addressDetails.address || addressDetails.streetName
                return `${tmp?tmp+', ': ''}${addressDetails.cityName}`
            },
            getFullName(userDetails) {
                return `${userDetails.firstName} ${userDetails.lastName}`
            },
            getDate(date) {
                console.log(111111, "Date: ", date)
                date = new Date(date) ||
               console.log(222222, "Date: ", date)
                // console.log(date, `${date.getUTCDate()+1}/${date.getMonth()+1}/${date.getFullYear()}`)
                return `${date.getDay()+1}/${date.getMonth()+1}/${date.getFullYear()}`
            },
            getGender(user) {
                // if (!user.employeeBirth.toString()) return 'null'
                let gender = user.employeeBirth.gender
                if (gender === "M") return 'man'
                if (gender === "W") return 'woman'
                return 'other'
            },
            applyFilters() {
                // function removeElementsWhichValueIsEmpty(obj) {
                //     let keys = Object.keys(obj)
                //     for (let i in keys) {
                //         let prop = obj.keys[i]
                //         if (!prop || !prop.length || !Object.keys(prop).length){
                //             delete obj[prop]
                //         }
                //         else if (typeof prop=== "object") {
                //             // let isArray = Array.isArray(prop)
                //             // if (!isArray.length) {
                //             //     delete obj[prop]
                //             // }
                //             removeElementsWhichValueIsEmpty(prop)
                //         }
                //     }
                // }
                // let toFilterObject = {
                //     status: {$in: {}},
                //     request: {
                //         employee: {
                //             employeeBirth: {
                //                 gender: '',
                //                 date: {
                //                     $gt: '',
                //                     $lt: '',
                //                 },
                //             }
                //         }
                //     },
                //     createdAt: {},
                // }
                // toFilterObject.status["$in"] = [...this.filterParams.status]
                // toFilterObject.createdAt = {$gt: this.filterParams.requestDate.start, $lt: this.filterParams.requestDate.end}
                // toFilterObject.request.employee.employeeBirth.gender = this.filterParams.gender
                // toFilterObject.request.employee.employeeBirth.date.$gt = this.filterParams.birthdayDate.start
                // toFilterObject.request.employee.employeeBirth.date.$lt = this.filterParams.birthdayDate.end
                // let filtersStr = JSON.stringify(toFilterObject)
                // filtersStr = filtersStr.replace(/["]/g, "\"")
                let filterStr = "{ "
                let params = this.filterParams
                const {status, gender, requestDate, birthdayDate} = params
                if(status.length) {
                    //I write \\ because \ gives error, but I filter in db and make it \
                    filterStr += `\\"status\\":{\\"$in\\": [\\"${status.join('\\", \\"')}\\"]}`
                }
                if (gender) {
                    filterStr += `, \\"request.employee.employeeBirth.gender\\": \\"${gender}\\"`
                }
                if (requestDate.start) {
                    let start = JSON.stringify(requestDate.start)
                    start = start.substring(1, start.length-1)
                    let end = JSON.stringify(requestDate.end)
                    end = end.substring(1, end.length-1)
                    filterStr += `, \\"createdAt\\": {\\"$gt\\": \\"${start}\\", \\"$lt\\": \\"${end}\\"}`
                }
                if (birthdayDate.start) {
                    let start = JSON.stringify(birthdayDate.start)
                    start = start.substring(1, start.length-1)
                    let end = JSON.stringify(birthdayDate.end)
                    end = end.substring(1, end.length-1)
                    filterStr += `, \\"request.employee.employeeBirth.date\\": {\\"$gt\\": \\"${start}\\", \\"$lt\\": \\"${end}\\"}`
                }
                filterStr +="}"
                console.log('changed', filterStr)
                this.$apollo.queries.items.refetch({filters: filterStr})
            }
        },
        beforeMount() {
            this.$apollo.queries.items.options.variables.filters = this.filtersStr;
        }
    }
    /*
    * , '$lt': '2020-07-16T08:54:38.459Z'
    * {status: { '$in': [ '200' ]},  request.employee.employeeBirth: [{date:{"$gt":"2001-07-16T19:00:00.000Z","$lt":"2020-07-16T08:54:38.459Z"}}],  createdAt: { '$gt': '2020-06-05T20:00:00.000Z', '$lt': '2020-07-16T08:54:38.459Z' }}
    * */
</script>

<style scoped>
    td {
        border: 1px solid black;
        padding: 3px 10px 3px 10px;
    }
    .item-header td{
        background-color: #9fdcdc;
    }
</style>

