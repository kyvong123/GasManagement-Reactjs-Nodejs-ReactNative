import { connect } from 'react-redux';
import withNetInfo from '../../helpers/withNetinfo';
import { fetchArticleServices, fetchArticleService } from './ServiceActions';
import { ServiceList } from '../../components/Services';
import { queryChanged, resetQuery } from '../../containers/Filters/FilterActions';
import { cleanArticles } from '../../containers/Articles/ArticleActions';


const mapStateToProps = (state) => ({
        services: state.get('ServiceReducer').get('services').toJS(),
        sumArticles: state.get('ServiceReducer').get('sumArticles'),
        loading: state.get('ServiceReducer').get('loading')
    });

export default connect(mapStateToProps, {fetchArticleServices, fetchArticleService, queryChanged, resetQuery, cleanArticles})(withNetInfo(ServiceList));