/**
 * @file app/my_images/page.jsx
 * @author Anshi
 * @description Displays a user's history of resized images, including original and resized versions, and resizing details.
 * @lastUpdated 2025-10-25
 */
'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { ImageModal } from "@/components/image-modal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

/**
 * @overview MyImagesPage component fetches and displays the authenticated user's image resizing history.
 * It retrieves original and resized image URLs, file names, timestamps, and interpolation methods
 * from Supabase, allowing users to view a gallery of their past resizing operations.
 * Users can also click on images to open a larger preview modal.
 * 
 * @returns {JSX.Element} The image history page, displaying a list of resized images or a message if none are found.
 */
export default function MyImagesPage() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const router = useRouter();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const openImageModal = useCallback((src, title) => {
    setModalImage({ src, title });
    setModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setModalOpen(false);
    setModalImage(null);
  }, []);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      console.error("User not authenticated:", sessionError?.message);
      toast({
        title: "Authentication Required",
        description: "Please log in to view your image history.",
        variant: "destructive",
      });
      router.push('/');
      return;
    }

    const userId = session.user.id;

    const { data, error } = await supabase
      .from('images_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching image history:", error);
      toast({
        title: "Error",
        description: `Failed to fetch image history: ${error.message}`,
        variant: "destructive",
      });
    } else {
      setImages(data);
    }
    setLoading(false);
  }, [router, toast]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDeleteImage = useCallback(async (imageId, originalImgUrl, resizedImgUrl) => {
    if (!confirm("Are you sure you want to delete this image and its history?")) return;

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to delete image history.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract file paths from URLs
      const originalPath = originalImgUrl.split('public/image_history/')[1];
      const resizedPath = resizedImgUrl.split('public/image_history/')[1];

      // Delete files from storage
      const { error: storageError } = await supabase.storage
        .from('image_history')
        .remove([originalPath, resizedPath]);

      if (storageError) throw storageError;

      // Delete record from database
      const { error: dbError } = await supabase
        .from('images_history')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      toast({
        title: "Image Deleted",
        description: "Image and its history successfully removed.",
      });
      fetchImages(); // Refresh the image list
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: `Failed to delete image: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [fetchImages, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-pink-100">
        <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
        <p className="ml-3 text-lg text-gray-700">Loading image history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-100">
      {/* Page Header: Navigation and Page Title */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => router.push('/')} 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Back to Resizer
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                My Images
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-rose-900 to-pink-900 bg-clip-text text-transparent mb-8 md:mb-10 text-center">
          Your Image History
        </h1>

        {images.length === 0 ? (
          <div className="text-center text-gray-600 text-lg md:text-xl py-10 md:py-20">
            <p>No resized images found yet.</p>
            <Button 
              onClick={() => router.push('/')} 
              className="mt-6 md:mt-8 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 px-8 py-3 md:px-10 md:py-4 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Go to Resizer
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {images.map((img) => (
              <Card key={img.id} className="overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="p-4 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold text-gray-800 truncate" title={img.file_name}>
                        {img.file_name}
                      </CardTitle>
                     
                      <p className="text-xs text-gray-500 mt-1">
                        Resized On: {new Date(img.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Method: {img.interpolation_method}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg opacity-70 hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 flex-shrink-0 ml-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete Image</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your image
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteImage(img.id, img.original_img, img.resized_img)}
                            className="bg-rose-500 hover:bg-rose-600 rounded-lg"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Original</p>
                      <button 
                        onClick={() => openImageModal(img.original_img, `Original: ${img.file_name}`)} 
                        className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-200 border border-gray-200"
                      >
                        <Image 
                          src={img.original_img} 
                          alt="Original Image" 
                          fill
                          className="object-contain"
                        />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Resized</p>
                      <button 
                        onClick={() => openImageModal(img.resized_img, `Resized: ${img.file_name}`)} 
                        className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-200 border border-gray-200"
                      >
                        <Image 
                          src={img.resized_img} 
                          alt="Resized Image" 
                          fill
                          className="object-contain"
                        />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ImageModal isOpen={modalOpen} onClose={closeImageModal} image={modalImage} />
    </div>
  );
}