import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { radii, spacing, typography } from '../constants/theme';
import { CoffeeProduct } from '../data/products';

type ProductCardProps = {
  product: CoffeeProduct;
  width: number;
  onPress?: () => void;
};

export function ProductCard({ product, width, onPress }: ProductCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.84}
      onPress={onPress}
      style={[styles.card, { width, backgroundColor: colors.card }]}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>
        <Text style={[styles.price, { color: colors.text }]}>{product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radii.md,
  },
  image: {
    width: '100%',
    aspectRatio: 1.2,
  },
  copy: {
    minHeight: 68,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  title: {
    fontSize: typography.caption,
    fontWeight: '500',
  },
  price: {
    fontSize: typography.body,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
});
