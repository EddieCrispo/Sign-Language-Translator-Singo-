package com.captsoneteamsingo.ui.home

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.captsoneteamsingo.databinding.FragmentHomeBinding
import com.captsoneteamsingo.ui.cameramenu.CameraActivity

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private val PERMISSIONS_REQUIRED = arrayOf(Manifest.permission.CAMERA)
    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            Toast.makeText(requireContext(), "Permission request granted", Toast.LENGTH_LONG).show()
            navigateToCamera()
        } else {
            Toast.makeText(requireContext(), "Permission request denied", Toast.LENGTH_LONG).show()
        }
    }

//    private val homeViewModel by viewModels<HomeViewModel>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        val root: View = binding.root

        binding.cameraMenuBtn.setOnClickListener {
            if (hasPermissions(requireContext())) {
                navigateToCamera()
            } else {
                requestPermissionLauncher.launch(Manifest.permission.CAMERA)
            }
        }

        return root
    }

    private fun navigateToCamera() {
        lifecycleScope.launchWhenStarted {
            requireActivity().startActivity(Intent(requireActivity(), CameraActivity::class.java))
        }
    }

    private fun hasPermissions(context: Context): Boolean {
        return PERMISSIONS_REQUIRED.all {
            ContextCompat.checkSelfPermission(context, it) == PackageManager.PERMISSION_GRANTED
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}