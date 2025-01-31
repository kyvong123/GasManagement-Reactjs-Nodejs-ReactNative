var indexCtrl={
    redirectToPage: function(page){
        if(page){
            $('#mainContent').load(page);

        }
        return false;
    }
}