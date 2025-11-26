import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 10 
    },
    content: { 
        alignItems: 'center', 
        paddingVertical: 30 
    },
    title: { 
        fontSize: 30, 
        fontWeight: 'bold', 
        color: '#FFD60A', 
        marginBottom: 20 
    },
    card: { 
        width: '90%', 
        backgroundColor: '#1C1C1E', 
        borderRadius: 10, 
        padding: 20, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#2C2C2E'
    },
    cardTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#FFF', 
        marginBottom: 10 
    },
    description: { 
        color: '#DDD', 
        fontSize: 14, 
        marginBottom: 15, 
        textAlign: 'left', 
        width: '100%' 
    },
    price: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#FFD60A', 
        marginBottom: 20 
    },
    button: { 
        width: '100%' 
    },
    note: { 
        color: '#8E8E93', 
        fontSize: 12, 
        marginTop: 15 
    },
    couponButton: {
        marginTop: 20,
        width: '90%', 
        backgroundColor: 'transparent', 
        borderWidth: 1,
        borderColor: '#FFD60A', 
    },
    supportButton: {
        marginTop: 10, 
        width: '90%',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#25D366', 
    }
});

export default styles;