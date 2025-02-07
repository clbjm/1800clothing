// JavaScript File - Create by Victor Chukhry
"use strict";
/*global let*/
/*global axios*/
/*global Vue*/
/*global localStorage*/



const carma_app = new Vue({
    el: '#carma-app',
    data: {
        costumes: [],
        baseUrl: 'http://www.1800clothing.org/carma/public/costumes',
        page: 1,
        perPage: 500,
        pages: [],
        searchInput: '',
        year_from: 0,
        year_to: 0,
        checkedItems: [],
        checked: true,
    },
    methods: {
        getCostumes() {
            axios.get(this.baseUrl)
                .then(response => {
                    this.costumes = response.data;
                })
                .catch(response => {
                    console.log(response);
                });
        },
        setPages() {
            let numberOfPages = Math.ceil(this.costumes.length / this.perPage);
            for (let index = 1; index <= numberOfPages; index++) {
                this.pages.push(index);
            }
        },
        paginate(costumes) {
            let page = this.page;
            let perPage = this.perPage;
            let from = (page * perPage) - perPage;
            let to = (page * perPage);
            return costumes.slice(from, to);
        },
        yearRangeSearch: function(year_from, year_to) {

            if (this.year_from == year_from && this.year_to == year_to) {
                this.searchInput = '';
                this.page = 1;
                this.costumes = [];
                this.pages = [];
                this.getCostumes();
            }
            else if (this.year_from != year_from && this.year_to != year_to) {
                this.searchInput = '';
                this.page = 1;
                this.costumes = [];
                this.pages = [];
                this.baseUrl = 'http://www.1800clothing.org/carma/public/yearssearch/' + year_from + '/' + year_to;
                this.getCostumes();
            }
            this.year_from = year_from;
            this.year_to = year_to;
        },

        getAllCostumes: function() {
            this.searchInput = '';
            this.page = 1;
            this.costumes = [];
            this.pages = [];
            this.baseUrl = 'http://www.1800clothing.org/carma/public/costumes';
            this.getCostumes();
        },
        
        checkMark: function () {
            let costumes;
            costumes = this.costumes.filter(post =>  this.checkedItems.includes(post.person));
            this.paginate(costumes);
        }
    },
    computed: {
        displayedCostumes() {
            let costumes;
            
            if (this.checkedItems.length > 0) {
                costumes = this.costumes.filter(post =>  this.checkedItems.includes(post.person));
                costumes = costumes.filter(post => { return post.description.toLowerCase().includes(this.searchInput.toLowerCase()); });
                this.pages = [];
                let numberOfPages = Math.ceil(costumes.length / this.perPage);
                for (let index = 1; index <= numberOfPages; index++) { this.pages.push(index); }
                return this.paginate(costumes);
            }
            
            else if (!this.searchInput == '') {
                costumes = this.costumes.filter(post => { return post.description.toLowerCase().includes(this.searchInput.toLowerCase()); });
                this.pages = [];
                let numberOfPages = Math.ceil(costumes.length / this.perPage);
                for (let index = 1; index <= numberOfPages; index++) { this.pages.push(index); }
                return this.paginate(costumes);
            }
            else { return this.paginate(this.costumes); }
        },

    },
    watch: {
        costumes() {
            this.setPages();
        },

    },

    created() {
        if(localStorage.getItem('year') !== null){
            let year = localStorage.getItem('year');
            this.baseUrl = 'http://www.1800clothing.org/carma/public/search/' + year;
            localStorage.clear();
        }
        else if(localStorage.getItem('year_from') !== null){
            let year_from = localStorage.getItem('year_from');
            let year_to = localStorage.getItem('year_to');
            this.baseUrl = 'http://www.1800clothing.org/carma/public/yearssearch/' + year_from + '/' + year_to;
            localStorage.clear();
        }
        this.getCostumes();
    }
});