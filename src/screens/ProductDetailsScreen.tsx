import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchCoffeeProduct } from '../api/coffeeApi';
import { PayButton } from '../components/PayButton';
import { SCREENS } from '../constants/screens';
import { colors, radii, spacing, typography } from '../constants/theme';
import { CoffeeProduct } from '../data/products';
import { HomeStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, typeof SCREENS.PRODUCT_DETAILS>;

export function ProductDetailsScreen({ navigation, route }: Props) {
  const [product, setProduct] = useState<CoffeeProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const productId = route.params?.productId;

  const loadProduct = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const selectedProduct = await fetchCoffeeProduct(productId);
      setProduct(selectedProduct);
    } catch {
      setErrorMessage('Could not load drink details. Check your connection and try again.');
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (isLoading) {
    return (
      <View style={styles.emptyState}>
        <ActivityIndicator color={colors.coffee} />
        <Text style={styles.description}>Loading drink details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.title}>Drink not found</Text>
        <Text style={styles.description}>
          {errorMessage || 'Product id was not passed or does not exist.'}
        </Text>
        {errorMessage ? <PayButton title="Try again" onPress={loadProduct} /> : null}
        <PayButton title="Back to menu" onPress={() => navigation.navigate(SCREENS.HOME)} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      {product.ingredients?.length ? (
        <View style={styles.ingredientsBlock}>
          <Text style={styles.ingredientsTitle}>Ingredients</Text>
          <Text style={styles.ingredientsText}>{product.ingredients.join(', ')}</Text>
        </View>
      ) : null}
      <PayButton
        title="Order"
        onPress={() => navigation.navigate(SCREENS.CHECKOUT, { productId: product.id })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  image: {
    width: '100%',
    aspectRatio: 1.15,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
    marginTop: spacing.xl,
  },
  price: {
    color: colors.coffeeDark,
    fontSize: typography.heading,
    fontWeight: '900',
    marginTop: spacing.sm,
  },
  description: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 21,
    marginTop: spacing.lg,
  },
  ingredientsBlock: {
    marginTop: spacing.lg,
  },
  ingredientsTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  ingredientsText: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
});
