/**
 * @file app/my_images/page.jsx
 * @author Anshi
 * @description Displays a user's history of resized images, including original and resized versions, and resizing details.
 * @lastUpdated 2025-10-21
 */
'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { ImageModal } from "@/components/image-modal";
import { handleImageDownload } from "@/lib/image-actions/handleImageDownload";
import { Download } from "lucide-react";

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

  useEffect(() => {
    const fetchImages = async () => {
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
    };

    fetchImages();
  }, [router, toast]);

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

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-rose-900 to-pink-900 bg-clip-text text-transparent mb-10 text-center">
          Your Image History
        </h1>

        {images.length === 0 ? (
          <div className="text-center text-gray-600 text-xl py-20">
            <p>No resized images found yet.</p>
            <Button 
              onClick={() => router.push('/')} 
              className="mt-8 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Go to Resizer
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((img) => (
              <Card key={img.id} className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-200/50 p-4">
                  <CardTitle className="text-lg font-semibold text-gray-800">{img.file_name}</CardTitle>
                  <p className="text-sm text-gray-500">Resized on: {new Date(img.created_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Method: {img.interpolation_method}</p>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Original</p>
                      <button 
                        onClick={() => openImageModal(img.original_img, `Original: ${img.file_name}`)} 
                        className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-200"
                      >
                        <Image 
                          src={img.original_img} 
                          alt="Original Image" 
                          layout="fill" 
                          objectFit="contain" 
                          className="object-contain"
                        />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Resized</p>
                      <button 
                        onClick={() => openImageModal(img.resized_img, `Resized: ${img.file_name}`)} 
                        className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity duration-200"
                      >
                        <Image 
                          src={img.resized_img} 
                          alt="Resized Image" 
                          layout="fill" 
                          objectFit="contain" 
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
